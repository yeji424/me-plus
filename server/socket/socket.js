import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { handlePlanRecommend } from '../controllers/planSocketController.js';
import { ChatSession } from '../models/ChatSession.js';
import { conditionByPlanGuide, InputRoleEnum } from '../utils/constants.js';
import { resetTokenCount } from '../services/gptService.js';

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

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });

    // 새채팅 (로컬스토리지 사용으로 MongoDB 삭제 불필요)
    socket.on('reset-session', async ({ sessionId }) => {
      // MongoDB 작업 제거 - 로컬스토리지에서 관리
      const newId = uuidv4();

      // 토큰 카운트 초기화
      resetTokenCount();

      socket.emit('session-id', newId);
      socket.emit('session-history', []);
    });
  });
};
