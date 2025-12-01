import { io } from "socket.io-client";
// Use http(s) URL for Socket.IO handshake in Node environment
const socket = io("http://localhost:3000", { transports: ["websocket"] });
socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", (reason) => {
  console.log(`Disconnected: ${reason}`);
});

socket.on("connect_error", (err) => {
  console.log(`Connection error: ${err.message}`);
});

// Example: handle a "message" event from server
socket.on("message", (data) => {
  console.log("Message from server: ", data);
});
