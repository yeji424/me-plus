/**
 * GPT Function Calling에 사용되는 tool definitions
 */
export const GPT_TOOLS = [
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
                id: { type: 'string', description: '항목 고유 ID 또는 태그' },
                label: { type: 'string', description: '버튼에 보여질 텍스트' },
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
                description: { type: 'string', description: '요금제 설명' },
                isPopular: { type: 'boolean', description: '인기 요금제 여부' },
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
      name: 'requestTextCard',
      description:
        '유저에게 특정 웹사이트나 링크로 안내할 때 사용합니다. URL의 미리보기 이미지와 함께 카드 형태로 보여줍니다. 유플러스 사이트나 추천하는 외부 링크를 안내할 때 사용합니다.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: '카드에 표시될 제목' },
          description: {
            type: 'string',
            description: '카드에 표시될 설명 텍스트',
          },
          url: { type: 'string', description: '안내할 링크 URL' },
          buttonText: {
            type: 'string',
            description:
              '버튼에 표시될 텍스트 (예: "자세히 보기", "사이트 방문하기")',
          },
          imageUrl: {
            type: 'string',
            description: '카드에 표시될 이미지 URL (선택사항)',
          },
        },
        required: ['title', 'description', 'url', 'buttonText'],
      },
    },
  },
];
