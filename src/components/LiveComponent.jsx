import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./LiveComponent.css";
function LiveComponent() {
  const [message, setMessage] = useState(null);
  const [ws, setWs] = useState(null);
  const [userId, setUserId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Initialize WebSocket connection
    const webSocketRef = io("http://localhost:3000", {
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
      setUsers(data);
    });

    webSocketRef.on("user connected", (data) => {
      console.log("User connected:", data);
      setUsers([...users, data]);
      console.log("All users:", users);
    });

    webSocketRef.on("private message", ({ content, from }) => {
      console.log("Private message from", from + ":", content);
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
    if (ws && userId && messageText) {
      ws.emit("private message", { userId, text: messageText });
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
            <li>{user.userID}</li>
          ))}
        </ul>
      </div>
      <div className="live-input-container">
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
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
