/** 기본 plan tool 정의
 * @note name, description 정의 필요
 */
export const BASE_PLAN_TOOL_DEF = {
  strict: true,
  type: 'function',
  parameters: {
    type: 'object',
    additionalProperties: false,
    properties: {
      plans: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            dataGb: {
              type: 'number',
              description: '기본 데이터',
            },
            sharedDataGb: { type: 'number', description: '공유 데이터' },
            monthlyFee: { type: 'number', description: '월정액' },
            detailUrl: { type: 'string', description: '상세페이지 링크' },
            bundleBenefit: {
              type: 'object',
              description: '결합 혜택 정보',
              additionalProperties: false,
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
              },
              required: ['_id', 'name', 'description'],
            },
          },
          required: [
            '_id',
            'name',
            'description',
            'dataGb',
            'sharedDataGb',
            'monthlyFee',
            'detailUrl',
            'bundleBenefit',
          ],
        },
      },
    },
    required: ['plans'],
  },
};
