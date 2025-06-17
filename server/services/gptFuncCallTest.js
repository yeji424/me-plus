import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { InputRoleEnum } from '../utils/constants.js';
import { BASE_PLAN_TOOL_DEF } from '../utils/gptTools.js';
import {
  getAffordablePlans,
  getOTTBundlePlans,
  getPlans,
  getUnlimitedDataPlans,
} from './gptFuncDefinitions.js';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const tools = [
  {
    ...BASE_PLAN_TOOL_DEF,
    name: 'getPlans',
    description: '요금제 전체 목록을 반환합니다.',
  },
  {
    ...BASE_PLAN_TOOL_DEF,
    name: 'getAffordablePlans',
    description: '월정액이 5만원 이하인 저렴한 요금제 목록을 반환합니다.',
  },
  {
    ...BASE_PLAN_TOOL_DEF,
    name: 'getUnlimitedDataPlans',
    description: '데이터가 무제한인 요금제 목록을 반환합니다.',
  },
  {
    ...BASE_PLAN_TOOL_DEF,
    name: 'getOTTBundlePlans',
    description: 'OTT 서비스가 결합된 요금제 목록을 반환합니다.',
  },
];

export const getDataByName = async (name) => {
  switch (name) {
    case 'getPlans':
      return await getPlans();
    case 'getAffordablePlans':
      return await getAffordablePlans();
    case 'getUnlimitedDataPlans':
      return await getUnlimitedDataPlans();
    case 'getOTTBundlePlans':
      return await getOTTBundlePlans();
  }
};

export const emitRecommendReasonByGuide = async (input, socket) => {
  while (true) {
    const stream = await openai.responses.create({
      model: 'gpt-4.1',
      input,
      tools,
      temperature: 0.3,
      max_output_tokens: 400,
      top_p: 1.0,
      stream: true,
    });
    let isFunctionCalling = false;

    for await (const event of stream) {
      // function calling으로 데이터 불러오기
      if (
        event.type === 'response.output_item.added' &&
        event.item.type === 'function_call'
      ) {
        isFunctionCalling = true;

        const toolCall = event.item;
        console.log('call function:', toolCall.name);
        input.push(toolCall);

        const data = await getDataByName(toolCall.name);
        input.push({
          type: 'function_call_output',
          call_id: toolCall.call_id,
          output: JSON.stringify(data),
        });

        input.push({
          role: InputRoleEnum.USER,
          content: '참고: 데이터에서 -1은 무제한을 의미함',
        });
      }

      // 대화 내용 저장
      if (event.item_id && event.item_id.startsWith('msg')) {
        socket.emit('recommend-plan-by-guide', event);

        if (event.type === 'response.output_text.done') {
          input.push({
            role: InputRoleEnum.ASSISTANT,
            content: event.text,
          });
        }
      }
    }

    if (isFunctionCalling) continue;
    return input;
  }
};

export const getPlanIds = async (input) => {
  const res = await openai.responses.create({
    model: 'gpt-4.1-nano',
    input,
    temperature: 0.3,
    max_output_tokens: 200,
    top_p: 1.0,
  });
  const endIndex = res.output_text.length - 1;

  return res.output_text.slice(1, endIndex).split(', ');
};

/** 아래부터는 테스트용 */
const json = {
  plans: [
    {
      _id: '684a33de9ed34ec0ddf7017d',
      name: '5G 프리미어 레귤러',
      description:
        'U⁺5G 서비스는 물론, 스마트기기 1개와 다양한 콘텐츠까지 마음껏 이용할 수 있는 5G 요금제',
      dataGb: -1,
      sharedDataGb: 80,
      monthlyFee: 95000,
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000433',
      bundleBenefit: {
        _id: '6849331b0963135e64792e73',
        name: 'U+ 투게더 결합',
        description:
          'U+휴대폰을 쓰는 친구, 가족과 결합하면 데이터 무제한 요금제를 최대 20,000원(4-5인 결합 시) 저렴하게 이용할 수 있어요.\n만 18세 이하 청소년은 매달 10,000원 더 할인 받을 수 있어요.',
      },
    },
    {
      _id: '684a33de9ed34ec0ddf70183',
      name: '유쓰 5G 데이터 플러스',
      description:
        '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 청년 전용 5G요금제',
      dataGb: 110,
      sharedDataGb: 50,
      monthlyFee: 66000,
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1000229',
      bundleBenefit: null,
    },
    {
      _id: '684a33de9ed34ec0ddf70187',
      name: '5G 프리미어 플러스',
      description:
        'U⁺5G 서비스는 물론, 스마트 기기 2개와 다양한 콘텐츠까지 마음껏 이용할 수 있는 5G 요금제',
      dataGb: -1,
      sharedDataGb: 100,
      monthlyFee: 105000,
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202205252',
      bundleBenefit: {
        _id: '6849331b0963135e64792e73',
        name: 'U+ 투게더 결합',
        description:
          'U+휴대폰을 쓰는 친구, 가족과 결합하면 데이터 무제한 요금제를 최대 20,000원(4-5인 결합 시) 저렴하게 이용할 수 있어요.\n만 18세 이하 청소년은 매달 10,000원 더 할인 받을 수 있어요.',
      },
    },
    {
      _id: '684a33de9ed34ec0ddf7018a',
      name: '(넷플릭스) 5G 프리미어 플러스',
      description:
        'U⁺5G 서비스는 물론, 스마트 기기 2개와 다양한 콘텐츠까지 마음껏 이용할 수 있는 5G 요금제',
      dataGb: -1,
      sharedDataGb: 100,
      monthlyFee: 105000,
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-category/LPZ0002536',
      bundleBenefit: {
        _id: '6849331b0963135e64792e73',
        name: 'U+ 투게더 결합',
        description:
          'U+휴대폰을 쓰는 친구, 가족과 결합하면 데이터 무제한 요금제를 최대 20,000원(4-5인 결합 시) 저렴하게 이용할 수 있어요.\n만 18세 이하 청소년은 매달 10,000원 더 할인 받을 수 있어요.',
      },
    },
    {
      _id: '684a33de9ed34ec0ddf7018c',
      name: '5G 라이트 청소년',
      description:
        '저렴한 요금으로 실속있게 U⁺5G 서비스를 이용할 수 있는 청소년 전용 5G 요금제',
      dataGb: 8,
      sharedDataGb: 0,
      monthlyFee: 45000,
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-youth/LPZ0000417',
      bundleBenefit: null,
    },
    {
      _id: '684a33de9ed34ec0ddf7017b',
      name: '5G 스텐다드',
      description:
        '넉넉한 데이터로 U⁺5G 서비스를 이용할 수 있는 5G 표준 요금제',
      dataGb: 150,
      sharedDataGb: 60,
      monthlyFee: 75000,
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000415',
      bundleBenefit: null,
    },
    {
      _id: '684a33de9ed34ec0ddf7017e',
      name: '유쓰 5G 스탠다드',
      description:
        '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 청년 전용 5G요금제',
      dataGb: 210,
      sharedDataGb: 65,
      monthlyFee: 75000,
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1000232',
      bundleBenefit: null,
    },
    {
      _id: '684a33de9ed34ec0ddf70180',
      name: '5G 데이터 레귤러',
      description:
        '필요한 만큼만 데이터를 선택할 수 있고, 다 쓰고 난 후에도 추가 요금 없이 데이터를 사용할 수 있는 요금제',
      dataGb: 50,
      sharedDataGb: 40,
      monthlyFee: 63000,
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000783',
      bundleBenefit: null,
    },
    {
      _id: '684a33de9ed34ec0ddf70181',
      name: '5G 데이터 플러스',
      description:
        '필요한 만큼만 데이터를 선택할 수 있고, 다 쓰고 난 후에도 추가 요금 없이 데이터를 사용할 수 있는 요금제',
      dataGb: 80,
      sharedDataGb: 45,
      monthlyFee: 66000,
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000782',
      bundleBenefit: null,
    },
    {
      _id: '684a33de9ed34ec0ddf70182',
      name: '5G 라이트+',
      description:
        '저렴한 요금으로 U⁺5G 서비스를 이용할 수 있는 5G 실속 요금제',
      dataGb: 14,
      sharedDataGb: 0,
      monthlyFee: 55000,
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000437',
      bundleBenefit: null,
    },
  ],
};

const input = [
  {
    role: 'system',
    content:
      "너는 통신 요금제 추천 챗봇이야. 사용자의 사용 패턴에 맞는 요금제를 추천해주는 것이 목적이야.아래는 사용자에게 요금제를 추천하며 말한 내용이야.\n내용:'데이터가 많은 요금제를 원하셔서, 데이터 무제한 제공 요금제 2가지를 추천합니다. 두 요금제 모두 5G 무제한 데이터에 각각 80GB, 70GB의 데이터 공유도 가능합니다. 월 요금은 각각 95,000원, 85,000원입니다.'\n이제 사용자의 요구를 더 정확히 파악하기 위해, 추가로 한 가지 질문을 사용자에게 해 줘.\n질문 작성 규칙:\n- 질문은 짧고 명확해야 해.\n- 월정액 금액, 데이터 사용량, 부가 서비스, 가족 결합 여부 등을 고려한 질문이면 좋아.\n- 너무 일반적인 질문보다는, 위의 추천 결과에 기반해서 파생된 질문을 만들어줘.\n대화 규칙:\n- 사용자가 질문에 긍정적으로 답변하면, 함수를 호출하여 그에 맞는 요금제가 있는지 확인하고, 사용자에게 '이 요금제를 살펴보시겠어요?' 같은 말로 추천을 제안해 줘.\n-사용자가  사용자가 부정적으로 답변하면, '그렇다면 나중에 다시 추천 도와드릴게요.' 같은 말로 자연스럽게 대화를 마무리해 줘.",
  },
  {
    role: 'assistant',
    content:
      '공유 데이터를 가족이나 다른 기기와 함께 사용하실 계획이 있으신가요?',
  },
  { role: 'user', content: '네 가족들과 자주 데이터를 공유합니다.' },
  {
    id: 'fc_684fcd11bb98819fab73de835dbf62c60bdacb01c698977a',
    type: 'function_call',
    status: 'completed',
    arguments:
      '{"plans":[{"_id":"plan1","name":"5G 프리미엄 플러스","description":"5G 무제한 데이터 제공, 80GB 데이터 공유 가능","dataGb":999,"sharedDataGb":80,"monthlyFee":95000,"detailUrl":"https://example.com/plan1","bundleBenefit":{"_id":"bundle1","name":"가족 결합 할인","description":"가족 결합 시 월 10,000원 할인"}},{"_id":"plan2","name":"5G 슈퍼 데이터","description":"5G 무제한 데이터 제공, 70GB 데이터 공유 가능","dataGb":999,"sharedDataGb":70,"monthlyFee":85000,"detailUrl":"https://example.com/plan2","bundleBenefit":{"_id":"bundle1","name":"가족 결합 할인","description":"가족 결합 시 월 10,000원 할인"}}]}',
    call_id: 'call_wkWjWyR7GLopX5XGfx8c1pyc',
    name: 'get_plans',
  },
  {
    type: 'function_call_output',
    call_id: 'call_wkWjWyR7GLopX5XGfx8c1pyc',
    output: JSON.stringify(json),
  },
  {
    role: 'assistant',
    content:
      '가족과 데이터를 자주 공유하신다면, 데이터 무제한에 최대 100GB까지 공유 가능한 "5G 프리미어 플러스" 요금제를 추천드립니다. 가족 결합 시 월 최대 20,000원까지 추가 할인을  받을 수 있습니다.\n\n이 요금제를 살펴보시겠어요? [자세히 보기](https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202205252)',
  },
  {
    role: 'user',
    content: '아뇨 다음에요.',
  },
];

export const getChatResponse = async () => {
  return await openai.responses.create({
    model: 'gpt-4.1',
    input,
    tools,
    temperature: 0.4,
    max_output_tokens: 300,
    top_p: 0.9,
  });
};
