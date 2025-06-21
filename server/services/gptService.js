import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GPTConfig } from '../utils/constants.js';
import { GPTStreamProcessor } from './gptStreamProcessor.js';
import { handleFunctionCall } from './gptFunctionHandler.js';
import { handleGPTError } from './gptErrorHandler.js';
import { GPT_TOOLS } from './gptToolDefinitions.js';

dotenv.config();

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * GPT 스트림 채팅을 처리합니다.
 * @param {Array} messages - 채팅 메시지 배열
 * @param {Socket} socket - 소켓 객체
 * @param {Function} onDelta - 델타 콜백 함수
 */
export const streamChat = async (messages, socket, onDelta) => {
  try {
    // 타임아웃 및 스트림 설정
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error('REQUEST_TIMEOUT')),
        GPTConfig.TIMEOUT_MS,
      );
    });

    const streamPromise = openai.chat.completions.create({
      model: GPTConfig.MODEL,
      messages,
      stream: true,
      tools: GPT_TOOLS,
    });

    const streamRes = await Promise.race([streamPromise, timeoutPromise]);

    // 스트림 프로세서 초기화
    const processor = new GPTStreamProcessor(socket, onDelta);

    // 스트림 처리
    for await (const chunk of streamRes) {
      const delta = chunk.choices[0].delta;

      // tool_calls 처리
      if (processor.processToolCalls(delta)) {
        continue;
      }

      // 일반 텍스트 content 처리
      const content = delta?.content;
      if (content) {
        if (processor.processContent(content)) {
          break; // 스트리밍 종료
        }
      }
    }

    // 스트리밍 완료 처리
    processor.finishStream();

    // 함수 호출이 감지된 경우 처리
    const { isFunctionCalled, functionName, functionArgsRaw } =
      processor.getFunctionCallInfo();
    if (isFunctionCalled) {
      await handleFunctionCall(functionName, functionArgsRaw, socket);
    }
  } catch (error) {
    handleGPTError(error, socket);
  }
};
