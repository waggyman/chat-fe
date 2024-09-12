import { io } from 'socket.io-client';

// Replace with your server URL
const SOCKET_URL = process.env.REACT_APP_API_URL;

const socket = io(SOCKET_URL);

export const setOnline = (userId) => {
  console.log("THE SOCKET", socket);
  socket.emit('setOnline', {userId});
};

export const sendMessage = (message) => {
  socket.emit('message', message);
};

export default socket;