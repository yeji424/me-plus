import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { ChatSession } from '../models/ChatSession.js';
import { handlePlanRecommend } from '../controllers/planSocketController.js';

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('🧑‍💻 User connected:', socket.id);

    // 세션 초기화 및 불러오기
    socket.on('init-session', async (sessionIdFromClient) => {
      let sessionId = sessionIdFromClient;
      let session = await ChatSession.findOne({ sessionId });

      // 없으면 새로 생성
      if (!session) {
        sessionId = uuidv4();
        session = await ChatSession.create({ sessionId, messages: [] });
      }

      socket.emit('session-id', sessionId);
      socket.emit('session-history', session.messages);
    });

    // 기본 대화
    socket.on('recommend-plan', (userInput) => {
      handlePlanRecommend(socket, userInput);
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });

    // 새채팅
    socket.on('reset-session', async ({ sessionId }) => {
      await ChatSession.deleteOne({ sessionId });
      const newId = uuidv4();
      await ChatSession.create({ sessionId: newId, messages: [] });
      socket.emit('session-id', newId);
      socket.emit('session-history', []);
    });
  });
};
