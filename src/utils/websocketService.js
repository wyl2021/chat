import io from 'socket.io-client';

const SOCKET_URL = 'http://www.swsai.com:5003/api/v1';
const socket = io(SOCKET_URL);

const WebSocketService = {
  setupSocketConnection () {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('FromServer', (message) => {
      console.log('Message from server:', message);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  },

  sendMessage (message) {
    socket.emit('FromClient', message);
  },

  disconnect () {
    socket.disconnect();
  }
};

export default WebSocketService;

