import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { handlePlanRecommend } from '../controllers/planSocketController.js';
import { ChatSession } from '../models/ChatSession.js';
import { conditionByPlanGuide, InputRoleEnum } from '../utils/constants.js';

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('🧑‍💻 User connected:', socket.id);

    // 세션 초기화 (로컬스토리지 사용으로 MongoDB 세션 불러오기 제거)
    socket.on('init-session', async (sessionIdFromClient) => {
      // 간단히 세션 ID만 생성/반환하고 빈 히스토리 반환
      const sessionId = sessionIdFromClient || uuidv4();

      socket.emit('session-id', sessionId);
      socket.emit('session-history', []); // 빈 배열 - 로컬스토리지에서 불러옴
    });

    // 기본 대화
    socket.on('chat', (userInput) => {
      handlePlanRecommend(socket, userInput);
    });

    // 제거: 로컬스토리지로 마이그레이션으로 인해 MongoDB 저장 불필요
    // socket.on('carousel-selection', (selectionData) => {
    //   handleCarouselSelection(socket, selectionData);
    // });

    // socket.on('update-carousel-selection', (updateData) => {
    //   handleUpdateCarouselSelection(socket, updateData);
    // });

    // socket.on('update-ott-selection', (updateData) => {
    //   handleUpdateOttSelection(socket, updateData);
    // });

    /** 가이드 별 적절한 요금제를 추천 */
    socket.on('recommend-plan-by-guide', async (message) => {
      console.log('recommend-plan-by-guide >>', message);
      const input = [
        {
          role: InputRoleEnum.SYSTEM,
          content:
            '너는 사용자의 조건에 맞는 휴대폰 요금제를 추천하는 전문가 챗봇이야. 사용자가 요금제 조건을 입력하면, 반드시 한 번 조건에 맞는 함수를 호출하여 데이터를 기반으로 요금제를 추천해야 해.\n\n요금제를 추천하는 이유는 간결하고 명확하게 설명해줘. 설명은 3줄 이내로 요약하고, 사용자의 조건(예: 데이터 용량, 가격, 연령대, 결합 혜택 등)과 관련된 요점만 언급해줘. 추천 이유만 말해야 해.',
        },
        {
          role: InputRoleEnum.USER,
          content: `조건: ${conditionByPlanGuide[message.guide]}`,
        },
      ];

      const planInput = await emitRecommendReasonByGuide(input, socket);
      const systemInput = {
        role: InputRoleEnum.SYSTEM,
        content:
          '너는 사용자의 조건에 맞는 휴대폰 요금제를 추천하는 전문가 챗봇이야. 주어진 조건과 추천 이유, 요금제 데이터를 보고 추천하는 요금제의 ID 목록을 최대 3가지 출력해줘. ID는 실제 데이터에 있는 _id를 사용해야 해. 응답은 반드시 배열로 출력해야 하고 다른 문장은 출력하면 안돼.',
      };
      console.log([systemInput, ...planInput.slice(1)]);
      const ids = await getPlanIds([systemInput, ...planInput.slice(1)]);
      socket.emit('recommend-plan-by-guide', { plans: ids });
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });

    // 새채팅 (로컬스토리지 사용으로 MongoDB 삭제 불필요)
    socket.on('reset-session', async ({ sessionId }) => {
      // MongoDB 작업 제거 - 로컬스토리지에서 관리
      const newId = uuidv4();
      socket.emit('session-id', newId);
      socket.emit('session-history', []);
    });
  });
};
