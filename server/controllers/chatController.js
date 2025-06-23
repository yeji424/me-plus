import { openai } from '../services/gptService.js';

/** 채팅 시작: 서술형 답변 예시 가져오기 */
export const getInputExamples = async (req, res) => {
  const getChatResponse = async () => {
    const input = [
      {
        role: 'system',
        content:
          '한국어로 요금제 추천 챗봇에게 사용자가 입력할 수 있는 질문 예시를 배열 형태로 3개 생성해줘. 예시는 자연스럽고 실제 사용자 질문처럼 작성하되, 너무 창의적인 표현은 피하고, 단정적이고 실용적인 문장으로 구성해줘. 부연 설명 없이 배열로만 답변해줘.\n답변: [입력 예시1, 입력 예시2, 입력 예시3]',
      },
    ];

    return await openai.responses.create({
      model: 'gpt-4.1-nano',
      input,
      temperature: 0.5,
      max_output_tokens: 256,
      top_p: 0.9,
    });
  };

  try {
    const chatResponse = await getChatResponse();
    const endIndex = chatResponse.output_text.length - 1;
    const inputs = chatResponse.output_text.slice(1, endIndex).split(', ');

    return res.status(200).json({ inputs });
  } catch (error) {
    return res.sendStatus(500);
  }
};
