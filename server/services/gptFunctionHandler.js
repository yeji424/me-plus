import { extractMetadata } from '../utils/metadataExtractor.js';
import { handleFunctionError } from './gptErrorHandler.js';
import {
  ErrorType,
  SocketEvent,
  OTTServices,
  OXOptions,
} from '../utils/constants.js';

/**
 * 함수 인자를 JavaScript 객체나 JSON으로 파싱합니다.
 * @param {string} functionArgsRaw - 원시 함수 인자 문자열
 * @returns {Object} 파싱된 인자 객체
 */
const parseFunctionArgs = (functionArgsRaw) => {
  if (!functionArgsRaw) return {};

  try {
    // JavaScript 객체 형식을 JSON으로 변환
    let fixedJson = functionArgsRaw
      // 1. 키에 따옴표 추가 (단어로 시작하는 키들만)
      .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
      // 2. 작은따옴표를 큰따옴표로 변환
      .replace(/'/g, '"')
      // 3. 숫자 뒤의 불필요한 소수점 제거 (-1.0 → -1)
      .replace(/(-?\d+)\.0(?=[,\s\]\}])/g, '$1')
      // 4. 줄바꿈과 연속된 공백 정리
      .replace(/\n\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    console.log(
      '🔄 변환 시도 (처음 200자):',
      fixedJson.substring(0, 200) + '...',
    );

    return JSON.parse(fixedJson);
  } catch (secondParseError) {
    // eval 방식으로 재시도
    try {
      console.warn('🔄 eval 방식으로 재시도...');
      return eval(`(${functionArgsRaw})`);
    } catch (evalError) {
      console.error('❌ 최종 JSON 파싱 실패:', secondParseError);
      console.error('❌ eval 방식도 실패:', evalError);
      console.log('🔍 원본:', functionArgsRaw);
      console.log('🔍 변환 시도:', fixedJson);
      throw new Error('Function arguments 파싱에 실패했습니다.');
    }
  }
};

/**
 * 각 함수별 처리 로직을 실행합니다.
 * @param {string} functionName - 호출할 함수 이름
 * @param {Object} args - 함수 인자
 * @param {Socket} socket - 소켓 객체
 */
export const executeFunctionCall = async (functionName, args, socket) => {
  switch (functionName) {
    case 'requestOTTServiceList': {
      socket.emit(SocketEvent.LOADING_END);
      socket.emit(SocketEvent.OTT_SERVICE_LIST, {
        question: '어떤 OTT 서비스를 함께 사용 중이신가요?',
        options: OTTServices,
      });
      break;
    }

    case 'requestOXCarouselButtons': {
      socket.emit(SocketEvent.LOADING_END);
      socket.emit(SocketEvent.OX_CAROUSEL_BUTTONS, {
        options: OXOptions,
      });
      break;
    }

    case 'requestCarouselButtons': {
      const { items } = args;
      if (!items) {
        handleFunctionError(
          ErrorType.MISSING_FUNCTION_ARGS,
          'requestCarouselButtons에 필요한 items가 없습니다.',
          { functionName, args },
          socket,
        );
        return;
      }
      socket.emit(SocketEvent.LOADING_END);
      socket.emit(SocketEvent.CAROUSEL_BUTTONS, items);
      break;
    }

    case 'showPlanLists': {
      const { plans } = args;
      if (!plans) {
        handleFunctionError(
          ErrorType.MISSING_FUNCTION_ARGS,
          'showPlanLists에 필요한 plans가 없습니다.',
          { functionName, args },
          socket,
        );
        return;
      }
      socket.emit(SocketEvent.LOADING_END);
      socket.emit(SocketEvent.PLAN_LISTS, plans);
      break;
    }

    case 'requestTextCard': {
      const { title, description, url, buttonText, imageUrl } = args;
      if (!title || !description || !url || !buttonText) {
        handleFunctionError(
          ErrorType.MISSING_FUNCTION_ARGS,
          'requestTextCard에 필요한 title, description, url, buttonText가 없습니다.',
          { functionName, args },
          socket,
        );
        return;
      }

      // imageUrl이 없으면 URL에서 메타데이터 추출
      let finalImageUrl = imageUrl;
      if (!finalImageUrl) {
        console.log('🔍 URL에서 메타데이터 추출 중:', url);
        finalImageUrl = await extractMetadata(url);
        console.log('📸 추출된 이미지 URL:', finalImageUrl);
      }

      socket.emit(SocketEvent.LOADING_END);
      socket.emit(SocketEvent.TEXT_CARD, {
        title,
        description,
        url,
        buttonText,
        imageUrl: finalImageUrl,
      });
      break;
    }

    case 'showFirstCardList': {
      socket.emit(SocketEvent.LOADING_END);
      socket.emit(SocketEvent.FIRST_CARD_LIST);
      break;
    }

    default:
      handleFunctionError(
        ErrorType.UNKNOWN_FUNCTION,
        `알 수 없는 function: ${functionName}`,
        { functionName, args },
        socket,
      );
  }
};

/**
 * 함수 호출을 처리합니다.
 * @param {string} functionName - 함수 이름
 * @param {string} functionArgsRaw - 원시 함수 인자
 * @param {Socket} socket - 소켓 객체
 */
export const handleFunctionCall = async (
  functionName,
  functionArgsRaw,
  socket,
) => {
  try {
    console.log('🔧 Function called:', functionName);
    console.log('📄 Raw arguments:', functionArgsRaw);

    const args = parseFunctionArgs(functionArgsRaw);
    console.log('✅ 파싱된 arguments:', args);

    await executeFunctionCall(functionName, args, socket);
  } catch (functionError) {
    console.error(`Function call 처리 실패 (${functionName}):`, functionError);

    if (functionError.message === 'Function arguments 파싱에 실패했습니다.') {
      handleFunctionError(
        ErrorType.FUNCTION_ARGS_PARSE_ERROR,
        'Function arguments 파싱에 실패했습니다.',
        {
          functionName,
          rawArgs: functionArgsRaw,
          parseError: functionError.message,
        },
        socket,
      );
    } else {
      handleFunctionError(
        ErrorType.FUNCTION_EXECUTION_ERROR,
        '기능 처리 중 오류가 발생했습니다.',
        {
          functionName,
          args: functionArgsRaw,
          error: functionError.message,
        },
        socket,
      );
    }
  }
};
