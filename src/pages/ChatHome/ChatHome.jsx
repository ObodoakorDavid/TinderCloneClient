import React from "react";
import useChat from "../../hooks/useChat";
import { useNavigate } from "react-router-dom";
import chatService from "../../service/chatService";
import useAuth from "../../hooks/useAuth";

const ChatHome = () => {
  const { onlineUsers } = useChat();
  const { user } = useAuth();

  console.log(onlineUsers);

  const navigate = useNavigate();

  const handleClick = async (participants) => {
    const chatId = await chatService.startChat(participants);
    console.log(chatId);
    navigate(`/chat/${chatId}`);
  };

  return (
    <div>
      {onlineUsers && onlineUsers.length > 0 ? (
        onlineUsers.map((eachUser) => (
          <div
            onClick={() => {
              handleClick([user.id, eachUser.userId]);
            }}
            key={eachUser.userId}
          >
            <p>{eachUser.userId}</p>
            {/* <Link to="#">Chat</Link> */}
          </div>
        ))
      ) : (
        <p>No online users available.</p>
      )}
    </div>
  );
};

export default ChatHome;
