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
      parallel_tool_calls: true,
    });

    // 함수 호출 정보 누적용
    const functionCallMap = {}; // { [item_id]: { ... } }
    const functionCalls = []; // 최종 실행용 배열

    for await (const event of stream) {
      console.log('event', event);
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
      }
    }

    // 모든 함수 호출 실행
    console.log(functionCalls);
    const functionResults = [];
    for (const { functionName, functionArgsRaw } of functionCalls) {
      await handleFunctionCall(functionName, functionArgsRaw, socket);
      // 간단한 메시지 형식으로 함수 실행 정보 추가
      functionResults.push({
        role: 'assistant',
        content: `${functionName} 함수를 호출했습니다. 인자: ${functionArgsRaw}`,
      });
      functionResults.push({
        role: 'user',
        content: `${functionName} 함수가 성공적으로 실행되었습니다.`,
      });
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
    // 2단계: function calling 완료 후 역질문 필요성 판단
    if (hasFunctionCalls) {
      console.log('🔄 Function calls detected, generating follow-up question');
      // 역질문 생성을 위한 새로운 턴
      await generateFollowUpQuestion(messages, functionResults, socket);
    }
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
  const userMessages = originalMessages.filter((msg) => msg.role === 'user');

  // 실행된 함수들 정보 추출
  const executedFunctions = functionResults
    .filter((result) => result.role === 'assistant')
    .map((result) => result.content)
    .join('\n');

  const followUpMessages = [
    {
      role: 'system',
      content: `너는 요금제 추천 후 추가 질문이 필요한지 판단하는 전문가야.

다음 상황에서만 역질문을 생성해:
1. 사용자의 데이터 사용량이 구체적이지 않을 때
2. 가족 결합 할인 가능성이 있을 때  
3. 특정 OTT 서비스 선호도를 확인해야 할 때
4. 통신사 선호도가 불분명할 때

역질문이 필요하면 다음 기능들을 사용할 수 있어:
- requestCarouselButtons: 선택지 버튼 제공
- requestOXCarouselButtons: 예/아니오 선택
- requestOTTServiceList: OTT 서비스 선택

역질문이 필요없다면 빈 응답을 해줘.
역질문이 필요하다면 간단하고 자연스러운 질문 하나만 해줘.`,
    },
    ...userMessages,
    {
      role: 'assistant',
      content: '요금제 검색을 완료했습니다.',
    },
    {
      role: 'system',
      content: `방금 실행된 함수들:
${executedFunctions}

위 함수 실행 결과를 바탕으로 추가 질문이 필요한지 판단해줘.`,
    },
    {
      role: 'user',
      content: '추가 질문이 필요한가요?',
    },
  ];

  console.log('🔄 Generating follow-up question with mini model');
  console.log('📝 Executed functions:', executedFunctions);

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
      parallel_tool_calls: true,
    });

    // 함수 호출 정보 누적용
    const functionCallMap = {}; // { [item_id]: { ... } }
    const functionCalls = []; // 최종 실행용 배열
    let hasTextContent = false; // 텍스트 응답이 있는지 확인

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
        console.log('🔄 Follow-up 로딩 시작:', functionName);
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
        socket.emit(SocketEvent.FOLLOWUP_STREAM, event.delta); // 별도 이벤트 사용
        console.log('📝 Follow-up text stream:', event.delta);
      }
    }

    // 역질문 함수 호출 실행
    console.log('Follow-up function calls:', functionCalls);
    console.log('Has text content:', hasTextContent);

    for (const { functionName, functionArgsRaw } of functionCalls) {
      await handleFunctionCall(functionName, functionArgsRaw, socket);
    }

    socket.emit(SocketEvent.DONE);
  } catch (error) {
    handleGPTError(error, socket);
  }
};
