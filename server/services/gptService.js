import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const streamChat = async (messages, socket, onDelta) => {
  try {
    // 타임아웃 설정 (30초)
    const timeoutMs = 30000;
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), timeoutMs);
    });

    const streamPromise = openai.chat.completions.create({
      model: 'gpt-4.1-mini-2025-04-14',
      messages,
      stream: true,
      tools: [
        {
          type: 'function',
          function: {
            name: 'requestOTTServiceList',
            description:
              '유저에게 통신사와 연결된 OTT 서비스 목록을 선택하도록 응답 받습니다.',
            parameters: { type: 'object', properties: {} },
          },
        },
        {
          type: 'function',
          function: {
            name: 'requestOXCarouselButtons',
            description:
              '유저에게 예/아니오로만 대답할 수 있는 선택지를 캐러셀 형태로 제공합니다.',
            parameters: { type: 'object', properties: {} },
          },
        },
        {
          type: 'function',
          function: {
            name: 'requestCarouselButtons',
            description:
              '유저에게 짧은 키워드나 명사형 선택지를 가로 스크롤 캐러셀 형태로 제공합니다. 통신사명, 요금대, 데이터량, 기술(5G/LTE) 등 단순한 카테고리 선택에 사용합니다.',
            parameters: {
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                  description: '캐러셀 버튼으로 보여줄 항목 리스트',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        description: '항목 고유 ID 또는 태그',
                      },
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
        },
        {
          type: 'function',
          function: {
            name: 'showPlanLists',
            description:
              '유저에게 여러 요금제 상세 정보를 카드 형식으로 제공합니다. 보통 3개 이상의 요금제를 추천할 때 사용합니다.',
            parameters: {
              type: 'object',
              properties: {
                plans: {
                  type: 'array',
                  description: '추천할 요금제 목록',
                  items: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string', description: '요금제 고유 ID' },
                      category: {
                        type: 'string',
                        description: '요금제 카테고리 (5G, LTE 등)',
                      },
                      name: { type: 'string', description: '요금제 이름' },
                      description: {
                        type: 'string',
                        description: '요금제 설명',
                      },
                      isPopular: {
                        type: 'boolean',
                        description: '인기 요금제 여부',
                      },
                      dataGb: {
                        type: 'number',
                        description: '기본 데이터 제공량 (-1은 무제한)',
                      },
                      sharedDataGb: {
                        type: 'number',
                        description: '공유/테더링 데이터 (GB)',
                      },
                      voiceMinutes: {
                        type: 'number',
                        description: '음성통화 시간 (-1은 무제한)',
                      },
                      addonVoiceMinutes: {
                        type: 'number',
                        description: '추가 음성통화 시간',
                      },
                      smsCount: {
                        type: 'number',
                        description: 'SMS 개수 (-1은 무제한)',
                      },
                      monthlyFee: { type: 'number', description: '월 요금' },
                      optionalDiscountAmount: {
                        type: 'number',
                        description: '최대 할인 가능 금액',
                      },
                      ageGroup: {
                        type: 'string',
                        description: '대상 연령대 (ALL, YOUTH 등)',
                      },
                      detailUrl: {
                        type: 'string',
                        description: '자세히 보기 링크 URL',
                      },
                      bundleBenefit: {
                        type: ['string', 'null'],
                        description: '결합 할인 정보',
                      },
                      mediaAddons: {
                        type: ['string', 'null'],
                        description: '미디어 부가서비스',
                      },
                      premiumAddons: {
                        type: ['string', 'null'],
                        description: '프리미엄 부가서비스',
                      },
                      basicService: {
                        type: 'string',
                        description: '기본 제공 서비스',
                      },
                    },
                    required: [
                      '_id',
                      'category',
                      'name',
                      'description',
                      'isPopular',
                      'dataGb',
                      'sharedDataGb',
                      'voiceMinutes',
                      'addonVoiceMinutes',
                      'smsCount',
                      'monthlyFee',
                      'optionalDiscountAmount',
                      'ageGroup',
                      'detailUrl',
                      'basicService',
                    ],
                  },
                },
              },
              required: ['plans'],
            },
          },
        },
        {
          type: 'function',
          function: {
            name: 'requestTextButtons',
            description:
              '유저에게 복잡한 문장형 응답 선택지를 세로 배열 버튼으로 제공합니다. 3개 이상의 선택지가 있고, 각 선택지가 완전한 문장이거나 상세한 설명일 때 사용합니다.',
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
        },
      ],
    });

    const streamRes = await Promise.race([streamPromise, timeoutPromise]);

    let isFunctionCalled = false;
    let functionName = '';
    let functionArgsRaw = '';
    let accumulatedContent = ''; // 텍스트 누적용

    for await (const chunk of streamRes) {
      const delta = chunk.choices[0].delta;

      // tool_calls 감지 (새로운 API 형식)
      if (delta.tool_calls) {
        isFunctionCalled = true;
        const toolCall = delta.tool_calls[0];

        if (toolCall.function?.name) {
          functionName = toolCall.function.name;
          console.log('🎯 Function name detected:', functionName);
        }

        if (toolCall.function?.arguments) {
          functionArgsRaw += toolCall.function.arguments;
          console.log('📝 Adding args chunk:', toolCall.function.arguments);
        }
        continue;
      }

      // 일반 메시지 content
      const content = delta?.content;
      if (content) {
        accumulatedContent += content;

        // 텍스트에서 function call 패턴 감지
        const functionCallMatch = accumulatedContent.match(
          /functions?\.(\w+)\s*\(\s*\{([\s\S]*?)\}\s*\)$/,
        );

        if (functionCallMatch) {
          console.log(
            '🔍 Text-based function call detected:',
            functionCallMatch[0],
          );

          // function call 부분을 제거한 텍스트만 전송
          const cleanContent = accumulatedContent
            .replace(/functions?\.(\w+)\s*\(\s*\{[\s\S]*?}\s*\)$/, '')
            .trim();

          if (cleanContent) {
            socket.emit('stream', cleanContent);
            onDelta?.(cleanContent);
          }

          // function call 실행
          isFunctionCalled = true;
          functionName = functionCallMatch[1];

          try {
            functionArgsRaw = `{${functionCallMatch[2]}}`;
            console.log('📄 Parsed function args:', functionArgsRaw);
          } catch (e) {
            console.error('❌ Failed to parse function args from text:', e);
          }

          break; // 스트리밍 종료
        } else {
          // 정상 텍스트 전송
          socket.emit('stream', content);
          onDelta?.(content);
        }
      }
    }

    if (isFunctionCalled) {
      try {
        console.log('🔧 Function called:', functionName);
        console.log('📄 Raw arguments:', functionArgsRaw);

        let args = {};
        if (functionArgsRaw) {
          try {
            args = JSON.parse(functionArgsRaw);
          } catch (parseError) {
            console.error('❌ JSON 파싱 실패:', parseError);
            console.log('🔍 파싱 실패한 JSON:', functionArgsRaw);

            // JSON 파싱 실패 에러를 클라이언트에게 전송
            socket.emit('error', {
              type: 'FUNCTION_ARGS_PARSE_ERROR',
              message: 'Function arguments 파싱에 실패했습니다.',
              details: {
                functionName,
                rawArgs: functionArgsRaw,
                parseError: parseError.message,
              },
            });
            return;
          }
        }

        switch (functionName) {
          case 'requestOTTServiceList': {
            socket.emit('ott-service-list', {
              question: '어떤 OTT 서비스를 함께 사용 중이신가요?',
              options: ['넷플릭스', '디즈니+', '티빙', '왓챠'],
            });
            break;
          }

          case 'requestOXCarouselButtons': {
            socket.emit('ox-carousel-buttons', {
              options: ['예', '아니오'],
            });
            break;
          }

          case 'requestCarouselButtons': {
            const { items } = args;
            if (!items) {
              socket.emit('error', {
                type: 'MISSING_FUNCTION_ARGS',
                message: 'requestCarouselButtons에 필요한 items가 없습니다.',
                details: { functionName, args },
              });
              return;
            }
            socket.emit('carousel-buttons', items);
            break;
          }

          case 'showPlanLists': {
            const { plans } = args;
            if (!plans) {
              socket.emit('error', {
                type: 'MISSING_FUNCTION_ARGS',
                message: 'showPlanLists에 필요한 plans가 없습니다.',
                details: { functionName, args },
              });
              return;
            }
            socket.emit('plan-lists', plans);
            break;
          }

          case 'requestTextButtons': {
            const { question, options } = args;
            if (!question || !options) {
              socket.emit('error', {
                type: 'MISSING_FUNCTION_ARGS',
                message:
                  'requestTextButtons에 필요한 question 또는 options가 없습니다.',
                details: { functionName, args },
              });
              return;
            }
            socket.emit('text-buttons', { question, options });
            break;
          }

          default:
            socket.emit('error', {
              type: 'UNKNOWN_FUNCTION',
              message: `알 수 없는 function: ${functionName}`,
              details: { functionName, args },
            });
        }
      } catch (functionError) {
        console.error(
          `Function call 처리 실패 (${functionName}):`,
          functionError,
        );
        socket.emit('error', {
          type: 'FUNCTION_EXECUTION_ERROR',
          message: '기능 처리 중 오류가 발생했습니다.',
          details: {
            functionName,
            args,
            error: functionError.message,
          },
        });
      }
    }

    socket.emit('done');
  } catch (error) {
    console.error('❌ GPT Service Error:', error);

    // 타임아웃 에러
    if (error.message === 'REQUEST_TIMEOUT') {
      socket.emit('error', {
        type: 'REQUEST_TIMEOUT',
        message: '⏱️ 응답 시간이 초과되었습니다. 다시 시도해주세요.',
        details: {
          timeout: '30초',
          message: error.message,
        },
      });
    }
    // OpenAI API 관련 에러
    else if (error.response) {
      socket.emit('error', {
        type: 'OPENAI_API_ERROR',
        message: 'AI 서비스 연결에 문제가 발생했습니다.',
        details: {
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.message,
        },
      });
    }
    // 네트워크 에러
    else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      socket.emit('error', {
        type: 'NETWORK_ERROR',
        message: '네트워크 연결에 문제가 발생했습니다.',
        details: {
          code: error.code,
          message: error.message,
        },
      });
    }
    // 스트리밍 에러
    else if (error.name === 'AbortError') {
      socket.emit('error', {
        type: 'STREAM_ABORTED',
        message: '스트리밍이 중단되었습니다.',
        details: {
          message: error.message,
        },
      });
    }
    // 기타 에러
    else {
      socket.emit('error', {
        type: 'UNKNOWN_ERROR',
        message: '예상치 못한 오류가 발생했습니다.',
        details: {
          message: error.message,
          stack: error.stack,
        },
      });
    }
  }
};
