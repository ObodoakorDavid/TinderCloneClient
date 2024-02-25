import React from "react";
import useChat from "../../hooks/useChat";
import { Link } from "react-router-dom";

const ChatHome = () => {
  const { onlineUsers } = useChat();
  console.log(onlineUsers);
  return (
    <div>
      {onlineUsers && (
        <>
          {onlineUsers.map((user, i) => (
            <div key={i}>
              <p>{user.userId}</p>
              <Link to={`/chat/${user.userId}`}>Chat</Link>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ChatHome;
