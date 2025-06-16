import OpenAI from 'openai';
import {
  getAffordablePlans,
  getOTTBundlePlans,
  getUnlimitedDataPlans,
} from './gptFuncDefinitions.js';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const streamChat = async (messages, socket, onDelta) => {
  const streamRes = await openai.chat.completions.create({
    model: 'gpt4.1-nano',
    messages,
    stream: true,
    function_call: 'auto',
    functions: [
      {
        name: 'getAffordablePlans',
        description: 'DB에 저장된 저렴한 요금제 목록을 반환합니다.',
        parameters: { type: 'object', properties: {} },
      },
      {
        name: 'getUnlimitedDataPlans',
        description: 'DB에 저장된 무제한 요금제 목록을 반환합니다.',
        parameters: { type: 'object', properties: {} },
      },
      {
        name: 'getOTTBundlePlans',
        description: 'DB에 저장된 OTT 서비스 결합 요금제를 반환합니다.',
        parameters: { type: 'object', properties: {} },
      },
      {
        name: 'requestOTTServiceList',
        description:
          '유저에게 통신사와 연결된 OTT 서비스 목록을 선택하도록 응답 받습니다.',
        parameters: { type: 'object', properties: {} },
      },
      {
        name: 'requestCarouselButtons',
        description:
          '유저의 화면에 캐러셀 버튼들을 보여주며, 버튼의 텍스트와 id를 포함한 항목들을 응답합니다.',
        parameters: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              description: '캐러셀 버튼으로 보여줄 항목 리스트',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: '항목 고유 ID 또는 태그' },
                  label: {
                    type: 'string',
                    description: '버튼에 보여질 텍스트',
                  },
                },
                required: ['id', 'label'],
              },
            },
          },
          required: ['items'],
        },
      },
      {
        name: 'showPlanLists',
        description:
          '유저에게 하나의 요금제 상세 정보를 카드 형식으로 제공합니다.',
        parameters: {
          type: 'object',
          properties: {
            plan: {
              type: 'object',
              properties: {
                name: { type: 'string', description: '요금제 이름' },
                monthlyFee: { type: 'number', description: '월 요금' },
                description: {
                  type: 'string',
                  description: '요금제 요약 설명',
                },
                dataGb: { type: 'number', description: '기본 데이터 제공량' },
                sharedDataGb: {
                  type: 'string',
                  description: '공유/테더링 데이터',
                },
                voiceMinutes: { type: 'string', description: '음성통화 내용' },
                bundleBenefit: {
                  type: 'string',
                  description: '결합 할인 정보',
                },
                baseBenefit: { type: 'string', description: '기본 제공 혜택' },
                specialBenefit: {
                  type: 'string',
                  description: '특별 제공 혜택',
                },
                detailUrl: {
                  type: 'string',
                  description: '자세히 보기 링크 URL',
                },
              },
              required: [
                'name',
                'monthlyFee',
                'description',
                'dataGb',
                'sharedDataGb',
                'voiceMinutes',
                'bundleBenefit',
                'baseBenefit',
                'specialBenefit',
                'detailUrl',
              ],
            },
          },
          required: ['plan'],
        },
      },
      {
        name: 'requestTextButtons',
        description: '유저에게 질문 텍스트와 버튼형 응답 선택지를 제공합니다.',
        parameters: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: '화면에 보여줄 질문 또는 안내 텍스트',
            },
            options: {
              type: 'array',
              description: '선택 가능한 버튼 항목 리스트',
              items: {
                type: 'string',
              },
            },
          },
          required: ['question', 'options'],
        },
      },
    ],
  });

  let isFunctionCalled = false;
  let functionName = '';
  let functionArgsRaw = '';

  for await (const chunk of streamRes) {
    const delta = chunk.choices[0].delta;

    // function_call 감지
    if (delta.function_call) {
      isFunctionCalled = true;
      if (delta.function_call.name) functionName = delta.function_call.name;
      if (delta.function_call.arguments)
        functionArgsRaw += delta.function_call.arguments;
      continue;
    }

    // 일반 메시지 content
    const content = delta?.content;
    if (content) {
      socket.emit('stream', content);
      onDelta?.(content); // 👈 델타 누적
    }
  }
  if (isFunctionCalled) {
    try {
      const args = functionArgsRaw ? JSON.parse(functionArgsRaw) : {};

      switch (functionName) {
        case 'getAffordablePlans': {
          const result = await getAffordablePlans();
          socket.emit('stream', JSON.stringify(result));
          break;
        }

        case 'getUnlimitedDataPlans': {
          const result = await getUnlimitedDataPlans();
          socket.emit('stream', JSON.stringify(result));
          break;
        }

        case 'getOTTBundlePlans': {
          const result = await getOTTBundlePlans();
          socket.emit('stream', JSON.stringify(result));
          break;
        }

        case 'requestOTTServiceList': {
          // 유저 응답용 프론트 출력
          socket.emit('ott-service-list', {
            question: '어떤 OTT 서비스를 함께 사용 중이신가요?',
            options: ['넷플릭스', '디즈니+', '티빙', '왓챠'],
          });
          break;
        }

        case 'requestCarouselButtons': {
          // GPT가 직접 넘겨준 items 사용
          const { items } = args;
          socket.emit('carousel-buttons', items);
          break;
        }

        case 'showPlanLists': {
          const { plan } = args;
          socket.emit('plan-lists', plan); // 프론트에서 카드형 UI로 표시
          break;
        }

        case 'requestTextButtons': {
          const { question, options } = args;
          socket.emit('text-buttons', { question, options });
          break;
        }

        default:
          socket.emit('stream', `⚠️ 알 수 없는 function: ${functionName}`);
      }
    } catch (error) {
      console.error(`Function call 처리 실패 (${functionName}):`, error);
      socket.emit('stream', '⚠️ 기능 처리 중 오류가 발생했습니다.');
    }
  }
  socket.emit('done');
};
