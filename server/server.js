import { createServer } from 'http';
import app from './app.js';
import { setupSocket } from './socket/socket.js';

const server = createServer(app);
setupSocket(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
