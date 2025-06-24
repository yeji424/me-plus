import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GPTConfig, SocketEvent, LoadingType } from '../utils/constants.js';
import { handleFunctionCall } from './gptFunctionHandler.js';
import { handleGPTError } from './gptErrorHandler.js';
import { GPT_TOOLS } from './gptToolDefinitions.js';

dotenv.config();

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 메타데이터 추출 함수
const extractMetadata = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      maxRedirects: 5,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const getMetaContent = (selector) => {
      const element = $(selector);
      return element.attr('content') || element.text() || null;
    };

    let imageUrl =
      getMetaContent('meta[property="og:image"]') ||
      getMetaContent('meta[name="twitter:image"]') ||
      null;

    // 상대 URL을 절대 URL로 변환
    if (imageUrl && !imageUrl.startsWith('http')) {
      const validUrl = new URL(url);
      if (imageUrl.startsWith('//')) {
        imageUrl = validUrl.protocol + imageUrl;
      } else if (imageUrl.startsWith('/')) {
        imageUrl = validUrl.origin + imageUrl;
      } else {
        imageUrl = validUrl.origin + '/' + imageUrl;
      }
    }

    return imageUrl;
  } catch (error) {
    console.warn('메타데이터 추출 실패:', error.message);
    return null;
  }
};

export const streamChat = async (
  messages,
  socket,
  onDelta,
  onFunctionCall = null,
) => {
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
