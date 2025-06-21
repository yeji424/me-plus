import { SocketEvent, LoadingType } from '../utils/constants.js';

/**
 * 스트림 처리 클래스
 */
export class GPTStreamProcessor {
  constructor(socket, onDelta) {
    this.socket = socket;
    this.onDelta = onDelta;
    this.isFunctionCalled = false;
    this.functionName = '';
    this.functionArgsRaw = '';
    this.accumulatedContent = '';
  }

  /**
   * 로딩 상태를 시작합니다.
   * @param {string} functionName - 함수 이름
   */
  startLoading(functionName) {
    this.socket.emit(SocketEvent.LOADING, {
      type: functionName.includes('Plan')
        ? LoadingType.DB_CALLING
        : LoadingType.SEARCHING,
      functionName: functionName,
    });
    console.log('🔄 로딩 시작:', functionName);
  }

  /**
   * tool_calls를 처리합니다.
   * @param {Object} delta - 스트림 델타 객체
   * @returns {boolean} 처리 여부
   */
  processToolCalls(delta) {
    if (!delta.tool_calls || delta.tool_calls.length === 0) {
      return false;
    }

    // 처음 tool_calls 감지 시 로딩 시작
    if (!this.isFunctionCalled) {
      this.isFunctionCalled = true;
      const toolCall = delta.tool_calls[0];
      const detectedFunctionName = toolCall.function?.name || 'unknown';
      this.startLoading(detectedFunctionName);
    }

    const toolCall = delta.tool_calls[0];

    if (toolCall.function?.name) {
      this.functionName = toolCall.function.name;
    }

    if (toolCall.function?.arguments) {
      this.functionArgsRaw += toolCall.function.arguments;
    }

    return true;
  }

  /**
   * 텍스트 content를 처리합니다.
   * @param {string} content - 텍스트 content
   * @returns {boolean} 스트리밍 종료 여부
   */
  processContent(content) {
    if (!content) return false;

    this.accumulatedContent += content;

    // 텍스트에서 function call 패턴 감지 (빈 괄호도 허용)
    const functionCallMatch = this.accumulatedContent.match(
      /functions?\.(\w+)\s*\(\s*(\{[\s\S]*?\})?\s*\)\s*$/,
    );

    if (functionCallMatch) {
      console.log(
        '🔍 Text-based function call detected:',
        functionCallMatch[0],
      );

      // 스트리밍 종료 신호 전송
      this.socket.emit(SocketEvent.DONE);

      // function call 실행 준비
      this.isFunctionCalled = true;
      this.functionName = functionCallMatch[1];
      this.startLoading(this.functionName);

      try {
        // 빈 괄호인 경우 빈 객체로 처리
        this.functionArgsRaw = functionCallMatch[2] || '{}';
      } catch (e) {
        console.error('❌ Failed to parse function args from text:', e);
        this.functionArgsRaw = '{}';
      }

      return true; // 스트리밍 종료
    }

    // function call이 시작되는 패턴 감지 (더 엄격하게)
    if (
      this.accumulatedContent.match(/functions?\.[\w]*\(?$/) ||
      this.accumulatedContent.includes('functions.') ||
      this.accumulatedContent.includes('function.')
    ) {
      // function call이 완성되기를 기다리므로 전송하지 않음
      console.log('🔍 Function call 패턴 감지, 완성 대기 중...');
      return false;
    }

    // "functions" 또는 "function" 단어만 있는 경우 체크
    if (
      this.accumulatedContent.includes(' functions') ||
      this.accumulatedContent.includes(' function') ||
      this.accumulatedContent.endsWith('functions') ||
      this.accumulatedContent.endsWith('function')
    ) {
      console.log('🔍 Function 키워드 감지, 다음 청크 대기 중...');
      return false;
    }

    // 정상 텍스트 전송
    this.socket.emit(SocketEvent.STREAM, content);
    this.onDelta?.(content);
    return false;
  }

  /**
   * 스트리밍 완료 처리를 합니다.
   */
  finishStream() {
    if (!this.isFunctionCalled) {
      // function call 시작 패턴이 있지만 완성되지 않은 경우 처리
      if (
        this.accumulatedContent.includes('functions.') ||
        this.accumulatedContent.includes('function.') ||
        this.accumulatedContent.includes(' functions') ||
        this.accumulatedContent.includes(' function') ||
        this.accumulatedContent.endsWith('functions') ||
        this.accumulatedContent.endsWith('function')
      ) {
        console.warn(
          '⚠️ 불완전한 function call 감지:',
          this.accumulatedContent.substring(
            Math.max(0, this.accumulatedContent.lastIndexOf('function') - 20),
          ),
        );

        // 불완전한 function call 부분 제거 후 전송
        const cleanedContent = this.accumulatedContent
          .replace(/\s*functions?\s*$/, '')
          .replace(/\s*function\s*$/, '')
          .trim();

        if (cleanedContent) {
          this.socket.emit(SocketEvent.STREAM, cleanedContent);
        }
      }

      this.socket.emit(SocketEvent.DONE);
    }
  }

  /**
   * 함수 호출 정보를 반환합니다.
   * @returns {{isFunctionCalled: boolean, functionName: string, functionArgsRaw: string}}
   */
  getFunctionCallInfo() {
    return {
      isFunctionCalled: this.isFunctionCalled,
      functionName: this.functionName,
      functionArgsRaw: this.functionArgsRaw,
    };
  }
}
