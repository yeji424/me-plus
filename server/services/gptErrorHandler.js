import { ErrorType } from '../utils/constants.js';

/**
 * GPT 서비스 에러를 분류하고 클라이언트에게 적절한 에러 메시지를 전송합니다.
 * @param {Error} error - 발생한 에러 객체
 * @param {Socket} socket - 소켓 객체
 */
export const handleGPTError = (error, socket) => {
  console.error('❌ GPT Service Error:', error);

  // 타임아웃 에러
  if (error.message === 'REQUEST_TIMEOUT') {
    socket.emit('error', {
      type: ErrorType.REQUEST_TIMEOUT,
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
      type: ErrorType.OPENAI_API_ERROR,
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
      type: ErrorType.NETWORK_ERROR,
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
      type: ErrorType.STREAM_ABORTED,
      message: '스트리밍이 중단되었습니다.',
      details: {
        message: error.message,
      },
    });
  }
  // 기타 에러
  else {
    socket.emit('error', {
      type: ErrorType.UNKNOWN_ERROR,
      message: '예상치 못한 오류가 발생했습니다.',
      details: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
};

/**
 * 함수 호출 관련 에러를 처리합니다.
 * @param {string} type - 에러 타입
 * @param {string} message - 에러 메시지
 * @param {Object} details - 에러 상세 정보
 * @param {Socket} socket - 소켓 객체
 */
export const handleFunctionError = (type, message, details, socket) => {
  socket.emit('loading-end');
  socket.emit('error', {
    type,
    message,
    details,
  });
};
