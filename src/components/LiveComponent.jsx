import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
function LiveComponent() {
  const [message, setMessage] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const webSocketRef = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    webSocketRef.on("connect", () => {
      console.log("WebSocket connected.");
    });
    webSocketRef.on("message", (data) => {
      const receivedData = JSON.parse(data);
      setMessage(receivedData); // Update state to trigger re-render
    });

    webSocketRef.on("disconnect", () => {
      console.log("WebSocket disconnected.");
      // Optional: Implement reconnection logic here
    });

    webSocketRef.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    webSocketRef.on("hello", (arg) => {
      console.error("Hello:", arg);
    });

    setWs(webSocketRef);
    // Cleanup function to close WebSocket on unmount
    return () => {
      webSocketRef.close();
    };
  }, []); // Empty dependency array ensures effect runs only once on mount

  return (
    <div>
      <h1>Live Data:</h1>
      {message ? (
        <pre>{JSON.stringify(message, null, 2)}</pre>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}

export default LiveComponent;
