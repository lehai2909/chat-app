import Message from "./Message";
import "./MessageList.css";
import { useEffect, useRef } from "react";

export default function MessageList({ messages, user }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="message-list-empty">
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <p className="empty-text">No messages yet</p>
          <p className="empty-subtext">Start a conversation by typing a message below</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <Message 
          key={index} 
          content={msg.content} 
          from={msg.from}
          user={user}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
