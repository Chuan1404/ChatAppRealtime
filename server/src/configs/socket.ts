import { Server } from "socket.io"

const USER_SESSIONS = [];
const onlineUsers = [];

const addUser = (userId: string, socketId: string): void => {
  // const isExist = onlineUsers.findIndex(item => item._id == user._id)

  // if(isExist !== -1) {
  //   onlineUsers.splice(isExist, 1)
  // }
  USER_SESSIONS.push({ userId, socketId });
};

function init(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("JOIN_ROOM", (chatRoomId) => {
      socket.join(chatRoomId);
    });

    socket.on("SEND_MESSAGE", (data) => {
      socket.to(data.chatRoomId).emit("RECEIVE_MESSAGE", data);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

export default {
  init,
};