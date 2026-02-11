import io from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const connectSocket = (token) => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    auth: {
      token
    }
  });

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinElection = (electionId) => {
  if (socket) {
    socket.emit('join:election', electionId);
  }
};

export const onVoteUpdate = (callback) => {
  if (socket) {
    socket.on('vote:updated', callback);
  }
};

export const onNotification = (callback) => {
  if (socket) {
    socket.on('notification:new', callback);
  }
};
