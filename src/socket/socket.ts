import { io } from "socket.io-client";

const URL = "http://localhost:5000";

// ✅ Create socket instance
export const socket = io(URL, {
  autoConnect: false, // security: don't connect automatically
});

// ✅ connect manually after login
export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};