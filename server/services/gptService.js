import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GPTConfig, SocketEvent, LoadingType } from '../utils/constants.js';
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
    const stream = await openai.responses.create({
      model: GPTConfig.MODEL,
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
    for (const { functionName, functionArgsRaw } of functionCalls) {
      await handleFunctionCall(functionName, functionArgsRaw, socket);
    }

    socket.emit(SocketEvent.DONE);
  } catch (error) {
    handleGPTError(error, socket);
  }
};
