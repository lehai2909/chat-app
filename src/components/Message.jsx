import "./Message.css";

export default function Message({ content, isSender, sender, from, user }) {
  // Determine if message is from sender based on available props
  const isFromSender = isSender !== undefined 
    ? isSender 
    : (sender === user || from === user);
  
  if (!content) {
    return null;
  }
  
  return (
    <div
      className={`message ${isFromSender ? "message-sender" : "message-friend"}`}
    >
      <p>{content}</p>
    </div>
  );
}
