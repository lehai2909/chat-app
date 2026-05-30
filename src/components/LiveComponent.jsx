import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./LiveComponent.css";
import { jwtDecode } from "../utils/jwtDecode";

function LiveComponent() {
  const [message, setMessage] = useState(null);
  const [ws, setWs] = useState(null);
  const [receiveUserId, setReceiveUserId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [users, setUsers] = useState([]);

  const username = sessionStorage.getItem("username") || "Guest";
  useEffect(() => {
    // Initialize WebSocket connection
    // const username = jwtDecode(
    //   import.meta.env.VITE_USERPOOL_ID,
    //   import.meta.env.VITE_CLIENT_ID
    // ).then((username) => {
    //   console.log("Decoded username:", username);
    // });
    console.log("Username for WebSocket:", username);
    const webSocketRef = io("http://localhost:3000", {
      auth: { username: username },
      transports: ["websocket"],
    });

    webSocketRef.on("connect", () => {
      console.log("WebSocket connected.");
    });
    webSocketRef.on("message", (data) => {
      console.log(data);
      // const receivedData = JSON.parse(data);
      setMessage(data); // Update state to trigger re-render
    });

    webSocketRef.on("users", (data) => {
      console.log("Active users:", data);
      setUsers(data || []);
    });

    webSocketRef.on("user connected", (data) => {
      console.log("User connected:", data);
      setUsers((prev) => [...prev, data]);
    });

    webSocketRef.on("user disconnected", (data) => {
      console.log("User disconnected:", data);
      setUsers((prev) => prev.filter((user) => user.userID != data));
    });

    webSocketRef.on("private message", ({ content, from, to }) => {
      console.log("Private message from ", from + "to: " + to + ": ", content);
    });

    webSocketRef.on("disconnect", () => {
      console.log("WebSocket disconnected.");
      // Optional: Implement reconnection logic here
    });

    webSocketRef.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    setWs(webSocketRef);
    // Cleanup function to close WebSocket on unmount
    return () => {
      webSocketRef.close();
    };
  }, []); // Empty dependency array ensures effect runs only once on mount

  const handleSendMessage = () => {
    // require websocket, sender id, receiver id and message text
    if (ws && receiveUserId && messageText) {
      ws.emit("private message", {
        from: username,
        to: receiveUserId,
        text: messageText,
      });
      setMessageText("");
    }
  };

  return (
    <div className="live-container">
      <h1 className="live-title">💬 Live Chat</h1>
      <div className="live-users-container">
        <h2 className="live-users-title">Active Users:</h2>
        <ul>
          {users.map((user) => (
            <li key={user.username}>{user.username}</li>
          ))}
        </ul>
      </div>
      <div className="live-input-container">
        <input
          type="text"
          placeholder="Current User ID"
          // value={username}
          // onChange={(e) => setCurrentUserId(e.target.value)}
          className="live-input"
        />
        <input
          type="text"
          placeholder="Receiver User ID"
          value={receiveUserId}
          onChange={(e) => setReceiveUserId(e.target.value)}
          className="live-input"
        />
        <input
          type="text"
          placeholder="Enter Message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="live-input"
        />
        <button onClick={handleSendMessage} className="live-button">
          Send
        </button>
      </div>
      <div className="live-data-container">
        <h2 className="live-data-title">Messages:</h2>
        {message ? (
          <pre className="live-data-box">
            {JSON.stringify(message, null, 2)}
          </pre>
        ) : (
          <p className="live-waiting-text">⏳ Waiting for data...</p>
        )}
      </div>
    </div>
  );
}

export default LiveComponent;
