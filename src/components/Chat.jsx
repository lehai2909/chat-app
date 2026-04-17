import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MessageList from "./MessageList";
import "./Chat.css";
import { useState, useEffect } from "react";
import { loadMessages } from "../utils/loadMessages";
import { putMessage } from "../utils/putMessage";
import { jwtDecode } from "../utils/jwtDecode";
import { io } from "socket.io-client";

const user = await jwtDecode(
  import.meta.env.VITE_USERPOOL_ID,
  import.meta.env.VITE_CLIENT_ID
);

export default function Chat() {
  if (!user) {
    sessionStorage.clear();
    window.location.href = "/login";
    return null;
  }

  const [messages, setMessages] = useState([]);
  const [chatTo, setChatTo] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [ws, setWs] = useState(null);

  const handleSendMessage = async () => {
    if (inputValue.trim() && chatTo.trim()) {
      const newMessage = {
        content: inputValue,
        from: user,
        to: chatTo,
      };

      try {
        await putMessage(newMessage);
        setMessages((prev) => [...prev, newMessage]);
        // emit private message over websocket so receiver can append in real-time
        try {
          ws &&
            ws.emit &&
            ws.emit("private message", {
              from: user,
              to: chatTo,
              text: inputValue,
            });
        } catch (e) {
          console.warn("Socket emit failed:", e);
        }
        setInputValue("");
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Please try again.");
      }
    }
  };

  // useEffect(() => {
  //   // create socket connection for chat (separate from LiveComponent)
  //   try {
  //     const webSocketRef = io("http://localhost:3000", {
  //       auth: { username: user },
  //       transports: ["websocket"],
  //     });
  //     setWs(webSocketRef);

  //     webSocketRef.on("connect", () => {
  //       console.log("Chat socket connected");
  //     });

  //     webSocketRef.on("private message", (msg) => {
  //       // append incoming private messages when current user is the recipient
  //       try {
  //         if (msg) {
  //           const appended = {
  //             content: msg.text ?? msg.content,
  //             from: msg.from,
  //             to: msg.to,
  //           };
  //           setMessages((prev) => {
  //             // simple de-duplication: check if same content/from/to already exists
  //             const exists = prev.some(
  //               (m) =>
  //                 m.content === appended.content &&
  //                 m.from === appended.from &&
  //                 m.to === appended.to
  //             );
  //             if (exists) return prev;
  //             return [...prev, appended];
  //           });
  //         }
  //       } catch (e) {
  //         console.error("Error handling incoming private message:", e);
  //       }
  //     });

  //     webSocketRef.on("disconnect", () => {
  //       console.log("Chat socket disconnected");
  //     });
  //   } catch (err) {
  //     console.error("Failed to create chat socket:", err);
  //   }

  //   return () => {
  //     if (ws) {
  //       try {
  //         ws.removeAllListeners && ws.removeAllListeners();
  //       } catch (e) {
  //         /* ignore */
  //       }
  //       try {
  //         ws.close && ws.close();
  //       } catch (e) {
  //         /* ignore */
  //       }
  //     }
  //   };
  // }, [user]);

  const handleChatFind = async () => {
    if (chatTo.trim()) {
      try {
        console.log(`Starting chat with ${chatTo}`);
        const loadedMessages = await loadMessages(user, chatTo);
        setMessages(loadedMessages || []);
      } catch (error) {
        console.error("Error loading messages:", error);
        alert("Failed to load messages. Please try again.");
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container fluid className="chat-container">
      <div className="chat-header">
        <h2>💬 Chat Application</h2>
        <p
          style={{
            margin: "0.5rem 0 0 0",
            color: "var(--text-secondary)",
            fontSize: "0.95rem",
          }}
        >
          Chatting as: <strong>{user}</strong>
        </p>
      </div>
      <Row>
        <Col md="4" className="chat-contact-div">
          <h3
            style={{
              marginBottom: "1rem",
              fontSize: "1.25rem",
              color: "var(--text-primary)",
            }}
          >
            Start a Conversation
          </h3>
          <div className="chat-to">
            <input
              type="text"
              placeholder="Enter username to chat with..."
              value={chatTo}
              onChange={(e) => setChatTo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChatFind()}
            />
            <button onClick={handleChatFind}>Start Chat</button>
          </div>
          {chatTo && (
            <p
              style={{
                marginTop: "1rem",
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
              }}
            >
              Chatting with: <strong>{chatTo}</strong>
            </p>
          )}
        </Col>
        <Col md="8" className="chat-messages-div">
          <MessageList messages={messages} user={user} />
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!chatTo}
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatTo || !inputValue.trim()}
            >
              Send
            </button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
