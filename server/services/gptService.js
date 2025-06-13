import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const streamChat = async (messages, socket, onDelta) => {
  const streamRes = await openai.chat.completions.create({
    model: 'gpt-4.1-nano',
    messages,
    stream: true,
    function_call: 'auto',
    functions: [
      {
        name: 'selectPriceRange',
        description: '사용자에게 선택 가능한 요금제 가격대를 보여줍니다.',
        parameters: {
          type: 'object',
          properties: {
            options: {
              type: 'array',
              items: { type: 'string' },
              description: '선택 가능한 가격대 옵션들',
            },
          },
          required: ['options'],
        },
      },
    ],
  });
  console.log('tet');
  let isFunctionCalled = false;
  let functionName = '';
  let functionArgsRaw = '';
  console.log('text');
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

  // 함수 호출 감지되었을 경우 처리
  if (isFunctionCalled && functionName === 'selectPriceRange') {
    try {
      const args = JSON.parse(functionArgsRaw);
      const options = args.options;
      socket.emit('price-options', options);
    } catch (err) {
      console.error('Function call argument 파싱 실패:', err);
      socket.emit('stream', '⚠️ 옵션 처리 중 오류가 발생했습니다.');
    }
  }

  socket.emit('done');
};
