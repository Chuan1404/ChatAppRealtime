const { Server } = require("socket.io");

const onlineUsers = [];

const addUser = (user, socketId) => {
  const isExist = onlineUsers.findIndex(item => item._id == user._id)

  if(isExist !== -1) {
    onlineUsers.splice(isExist, 1)
  }
  user.socketId = socketId;
  onlineUsers.push(user)
};

function init(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("ADD_USER", (user) => {
      addUser(user, socket.id);
      io.emit("USER_ADDED", onlineUsers)
    });

    socket.on("SEND_MESSAGE", data => {
      socket.broadcast.emit('RECEIVE_MESSAGE', data);
    })

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

module.exports = {
  init,
};
