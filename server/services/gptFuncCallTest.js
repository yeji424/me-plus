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
