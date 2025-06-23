import { io } from 'socket.io-client';

// 환경변수에서 API URL 가져오기, 기본값은 로컬 개발 서버
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const socket = io(API_BASE_URL);
