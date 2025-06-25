import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GPTConfig, SocketEvent, LoadingType } from '../utils/constants.js';
import { handleFunctionCall } from './gptFunctionHandler.js';
import { handleGPTError } from './gptErrorHandler.js';
import { GPT_TOOLS } from './gptToolDefinitions.js';

dotenv.config();

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 역질문 전용 도구들 (캐러셀, OX, OTT 버튼만)
const FOLLOWUP_TOOLS = GPT_TOOLS.filter((tool) =>
  [
    'requestCarouselButtons',
    'requestOXCarouselButtons',
    'requestOTTServiceList',
  ].includes(tool.name),
);
let usedTotalTokens = 0;

/**
 * GPT 스트림 채팅을 처리합니다.
 * @param {Array} messages - 채팅 메시지 배열
 * @param {Socket} socket - 소켓 객체
 * @param {Function} onDelta - 델타 콜백 함수
 * @param {string} model - 사용할 GPT 모델 (기본값: GPTConfig.MODEL)
 * @returns {Promise<{ hasFunctionCalls: boolean, functionResults: Array }>}
 */
export const streamChat = async (
  messages,
  socket,
  onDelta,
  model = GPTConfig.MODEL,
) => {
  try {
    const stream = await openai.responses.create({
      model: model,
      input: messages,
      stream: true,
      tool_choice: 'auto',
      tools: GPT_TOOLS,
      parallel_tool_calls: false,
    });

    // 함수 호출 정보 누적용
    const functionCallMap = {}; // { [item_id]: { ... } }
    const functionCalls = []; // 최종 실행용 배열

    for await (const event of stream) {
      // 1. 함수 호출 item 추가
      if (
        event.type === 'response.output_item.added' &&
        event.item.type === 'function_call'
      ) {
        functionCallMap[event.item.id] = {
          ...event.item,
          arguments: '',
        };

        // 함수명에 따라 DB 호출/검색 타입 구분해서 로딩 emit
        const functionName = event.item.name;
        socket.emit(SocketEvent.LOADING, {
          type: functionName?.includes('Plan')
            ? LoadingType.DB_CALLING
            : LoadingType.SEARCHING,
          functionName: functionName,
        });
        console.log('🔄 로딩 시작:', functionName);
      }

      // 2. arguments 조각 누적
      else if (event.type === 'response.function_call_arguments.delta') {
        const id = event.item_id;
        if (functionCallMap[id]) {
          functionCallMap[id].arguments += event.delta;
        }
      }

      // 3. arguments 누적 완료(함수 호출 하나 완성)
      else if (event.type === 'response.function_call_arguments.done') {
        const id = event.item_id;
        const call = functionCallMap[id];
        if (call) {
          functionCalls.push({
            functionName: call.name,
            functionArgsRaw: call.arguments,
          });
        }
      }

      // 4. 일반 텍스트 스트림 (output_text 등)
      else if (event.type === 'response.output_text.delta') {
        socket.emit(SocketEvent.STREAM, event.delta);
        if (onDelta) onDelta(event.delta);
      } else if (event.type === 'response.completed') {
        usedTotalTokens += event.response.usage.total_tokens;
        if (onDelta) onDelta(event.delta);
      }
    }

    // 모든 함수 호출 실행
    console.log(functionCalls);
    const functionResults = [];
    for (const { functionName, functionArgsRaw } of functionCalls) {
      const result = await handleFunctionCall(
        functionName,
        functionArgsRaw,
        socket,
      );

      // 함수 실행 정보 추가
      functionResults.push({
        role: 'assistant',
        content: `${functionName} 함수를 호출했습니다. 인자: ${functionArgsRaw}`,
      });

      // searchPlans 함수의 경우 검색 결과 상세 정보 추가
      console.log('여기야', functionName, result);
      if (functionName === 'searchPlans' && result) {
        if (result.result === 'empty') {
          functionResults.push({
            role: 'function',
            name: functionName,
            content: `검색 결과: 빈 배열 (조건에 맞는 요금제 없음)`,
          });
        } else if (result.result === 'found') {
          functionResults.push({
            role: 'function',
            name: functionName,
            content: `검색 결과: ${result.plansCount}개 요금제 발견 (${result.planNames?.join(', ')})`,
          });
        }
      } else {
        functionResults.push({
          role: 'user',
          content: `${functionName} 함수가 성공적으로 실행되었습니다.`,
        });
      }
    }

    socket.emit(SocketEvent.DONE);

    return {
      hasFunctionCalls: functionCalls.length > 0,
      functionResults: functionResults,
    };
  } catch (error) {
    handleGPTError(error, socket);
    return { hasFunctionCalls: false, functionResults: [] };
  }
};

/**
 * 멀티턴 채팅 (function calling → 역질문 생성)
 */
export const streamChatWithFollowUp = async (messages, socket, onDelta) => {
  try {
    // 1단계: 기존 streamChat 사용하여 function call 여부 확인
    const { hasFunctionCalls, functionResults } = await streamChat(
      messages,
      socket,
      onDelta,
    );

    // 2단계: 특정 함수 호출 시에만 역질문 생성
    if (hasFunctionCalls) {
      // 역질문 대상 함수들
      const followUpTargetFunctions = ['requestTextCard', 'showPlanLists'];
      console.log(functionResults);
      // 실행된 함수들 중 역질문 대상이 있는지 확인
      const executedFunctionNames = functionResults
        .filter((result) => result.role === 'assistant')
        .map((result) => {
          const match = result.content.match(/^(\w+) 함수를 호출했습니다/);
          return match ? match[1] : null;
        })
        .filter(Boolean);

      const shouldGenerateFollowUp = executedFunctionNames.some((funcName) =>
        followUpTargetFunctions.includes(funcName),
      );

      if (shouldGenerateFollowUp) {
        console.log(
          '🔄 Target functions detected, generating follow-up question',
        );
        console.log('📝 Executed functions:', executedFunctionNames);
        // 역질문 생성을 위한 새로운 턴
        await generateFollowUpQuestion(messages, functionResults, socket);
      } else {
        console.log('⏭️ No target functions, skipping follow-up question');
        console.log('📝 Executed functions:', executedFunctionNames);
      }
    }

    console.log('🔄 Used total tokens:', usedTotalTokens);
  } catch (error) {
    handleGPTError(error, socket);
  }
};

/**
 * 역질문 생성 (별도 턴)
 */
const generateFollowUpQuestion = async (
  originalMessages,
  functionResults,
  socket,
) => {
  // 역질문 전용 메시지 구성 (기존 시스템 프롬프트 제외)
  const userMessages = originalMessages.filter((msg) => msg.role !== 'system');

  // 실행된 함수들 정보 추출
  const executedFunctions = functionResults
    .filter((result) => result.role === 'assistant')
    .map((result) => result.content)
    .join('\n');

  // requestTextCard가 이미 실행되었는지 확인
  const hasTextCardExecuted = functionResults.some(
    (result) =>
      result.role === 'assistant' && result.content.includes('requestTextCard'),
  );

  const followUpMessages = [
    {
      role: 'system',
      content: `너는 요금제 추천 후 고객에게 추가 혜택을 안내하는 상담사야.

**ImageCard(requestTextCard) 실행 확인:**
${
  hasTextCardExecuted
    ? `- 이미 링크 정보가 제공되었으므로, 추가 부가서비스 링크는 보내지 않아야 함
- 대신 "추천드린 요금제들을 참고해서 본인에게 맞는 요금제를 선택해보세요! 😊 추가 궁금한 점이 있으시면 언제든 말씀해주세요!" 같은 자연스러운 마무리 멘트로 대화를 정리해줘
- 새로운 함수 호출은 하지 말고, 일반적인 텍스트 응답으로만 마무리하기`
    : `- 아직 링크 정보가 제공되지 않았으므로, 아래 패턴에 따라 추가 혜택 질문을 진행해도 됨`
}

**검색 결과 확인 우선:**
- 방금 showPlanLists 함수가 빈 배열([])을 반환했다면, 조건에 맞는 요금제가 없다는 뜻이야
- 이 경우 "조건에 맞는 요금제를 찾지 못했어요. 😅 다른 옵션을 확인해보시는 것은 어떨까요?"라고 안내하고 다음 중 하나를 제안해줘:

**검색 결과 없음 시 대안 제시:**
1. "예산을 조금 더 늘려서 찾아볼까요?" → requestCarouselButtons로 더 높은 가격대 옵션 제공
2. "다른 통신 기술(5G/LTE)도 함께 살펴보시겠어요?" → requestOXCarouselButtons 호출  
3. "대신 인기 요금제들을 추천해드릴까요?" → requestCarouselButtons로 ["인기 요금제 보기", "조건 다시 설정", "상담원 연결"] 제공
4. "조건을 다시 설정해서 찾아보시겠어요?" → requestCarouselButtons로 새로운 선택지 제공

**매우 중요함**
이미 요금제를 보여줬으니, 요금제 설명은 다시 하지 말고 추가 혜택 질문만 해줘:

**중요: 질문 텍스트를 먼저 출력하고 그 다음에 함수 호출**

**질문 예시들:**
1. "혹시 가족 구성원 중 만 18세 이하의 청소년 자녀가 있으신가요? 있으시다면 추가 결합 혜택도 안내드릴게요!" 
   → 이 질문 텍스트를 먼저 출력한 후 requestOXCarouselButtons 호출
   
2. "혹시 사용 중인 인터넷이 있으신가요? LG U+에서 500Mbps 이상 인터넷을 사용 중이시면 추가 할인을 받을 수 있어요!" 
   → 이 질문 텍스트를 먼저 출력한 후 requestOXCarouselButtons 호출
   
3. "평소 한 달에 데이터를 얼마나 사용하시나요? 더 정확한 요금제를 추천드릴게요!" 
   → 이 질문 텍스트를 먼저 출력한 후 requestCarouselButtons 호출
   
4. "평소 자주 시청하시는 OTT 서비스가 있으신가요? 요금제와 함께 이용하시면 더 저렴해질 수 있어요!" 
   → 이 질문 텍스트를 먼저 출력한 후 requestOTTServiceList 호출

**절대 규칙:**
- 요금제 정보는 절대 다시 설명하지 마
- **매우 중요**: 반드시 질문 텍스트를 먼저 출력하고 그 다음에 함수 호출해야 함
- 텍스트 없이 바로 함수만 호출하는 것은 절대 금지
- "답변해주세요", "알려주세요" 같은 추가 멘트 금지
- 검색 결과가 없으면 검색 결과 없음 대안 제시가 우선, 결과가 있으면 추가 혜택 질문

**올바른 응답 형식:**
1. 먼저 텍스트로 질문을 출력 (예: "혹시 가족 구성원 중 만 18세 이하의 청소년 자녀가 있으신가요?")
2. 그 다음에 함수 호출 (예: requestOXCarouselButtons)

**잘못된 예시 (금지):**
- 텍스트 없이 바로 requestCarouselButtons 호출 
- 텍스트 없이 바로 requestOXCarouselButtons 호출 
- 텍스트 없이 바로 requestOTTServiceList 호출 `,
    },
    ...userMessages,
    {
      role: 'assistant',
      content: '요금제를 확인해보세요.',
    },
    {
      role: 'system',
      content: `방금 실행된 함수들:
${executedFunctions}

🚨 중요: 무조건 아래 순서대로 해야 함:
1. 먼저 텍스트로 질문 출력 (예: "혹시 가족분들과 함께 가입하시면 더 저렴해질 수 있는데, 관심 있으신가요?")
2. 그 다음에 함수 호출 (예: requestOXCarouselButtons)

텍스트 없이 바로 함수만 호출하는 것은 절대 금지. 반드시 텍스트 먼저 출력하고 함수 호출.`,
    },
  ];

  // 역질문 전용 streamChat 호출 (FOLLOWUP_TOOLS 사용)
  await streamChatForFollowUp(followUpMessages, socket, GPTConfig.MODEL_MINI);
};

/**
 * 역질문 전용 스트림 채팅 (제한된 도구만 사용)
 */
const streamChatForFollowUp = async (messages, socket, model) => {
  try {
    const stream = await openai.responses.create({
      model: model,
      input: messages,
      stream: true,
      tool_choice: 'auto',
      tools: FOLLOWUP_TOOLS, // 역질문 전용 도구만 사용
    });

    // 함수 호출 정보 누적용
    const functionCallMap = {}; // { [item_id]: { ... } }
    const functionCalls = []; // 최종 실행용 배열
    let hasTextContent = false; // 텍스트 응답이 있는지 확인
    usedTotalTokens = 0;
    for await (const event of stream) {
      // 1. 함수 호출 item 추가
      if (
        event.type === 'response.output_item.added' &&
        event.item.type === 'function_call'
      ) {
        functionCallMap[event.item.id] = {
          ...event.item,
          arguments: '',
        };

        const functionName = event.item.name;
        socket.emit(SocketEvent.LOADING, {
          type: LoadingType.SEARCHING,
          functionName: functionName,
        });
      }

      // 2. arguments 조각 누적
      else if (event.type === 'response.function_call_arguments.delta') {
        const id = event.item_id;
        if (functionCallMap[id]) {
          functionCallMap[id].arguments += event.delta;
        }
      }

      // 3. arguments 누적 완료(함수 호출 하나 완성)
      else if (event.type === 'response.function_call_arguments.done') {
        const id = event.item_id;
        const call = functionCallMap[id];
        if (call) {
          functionCalls.push({
            functionName: call.name,
            functionArgsRaw: call.arguments,
          });
        }
      }

      // 4. 일반 텍스트 스트림 (output_text 등) - 역질문 전용 스트림 사용
      else if (event.type === 'response.output_text.delta') {
        hasTextContent = true;
        socket.emit(SocketEvent.FOLLOWUP_STREAM, event.delta);
      } else if (event.type === 'response.completed') {
        usedTotalTokens += event.response.usage.total_tokens;
      }
    }

    // 역질문 함수 호출 실행
    console.log('Has text content:', hasTextContent);

    for (const { functionName, functionArgsRaw } of functionCalls) {
      await handleFunctionCall(functionName, functionArgsRaw, socket);
    }

    socket.emit(SocketEvent.DONE);
  } catch (error) {
    handleGPTError(error, socket);
  }
};
