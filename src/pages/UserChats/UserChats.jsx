import React from "react";
import { Link } from "react-router-dom";
import useChat from "../../hooks/useChat";

const UserChats = () => {
  const { chats, isTyping } = useChat();

  console.log(chats);

  return (
    <div>
      {chats && chats.length > 0 ? (
        chats.map((chat) => (
          <Link
            to={`/chat/${chat.chatId}`}
            className="border rounded-2 text-start p-3 d-flex align-items-center gap-3 text-decoration-none text-black"
            key={chat.chatId}
          >
            <img
              className="rounded-circle w-25"
              src={chat.otherUser.image}
              alt=""
            />
            <div>
              <p>{chat.otherUser?.userId.firstName}</p>
              {isTyping.typing && isTyping.chatId === chat.chatId ? (
                <p className=" text-dark-emphasis">Typing...</p>
              ) : (
                <p>{chat.lastMessage?.text}</p>
              )}
            </div>
          </Link>
        ))
      ) : (
        <p>No Chats available.</p>
      )}
    </div>
  );
};

export default UserChats;
