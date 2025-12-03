import { Server } from "socket.io";

const io = new Server({
  /* options */
});

io.on("connection", (socket) => {
  console.log("a user connected");
  console.log("Socket handshake:", socket.handshake);
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("message", msg);
  });

  socket.emit("message", "Welcome to the server!");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // Chat app
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  console.log(users);
  socket.emit("users", users);
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  socket.on("private message", ({ from, to, text }) => {
    console.log(`Private message from ${from} to ${to}: ${text}`);
    socket.to(to).emit("private message", {
      content: text,
      from: from,
    });
  });
});

io.listen(3000);
