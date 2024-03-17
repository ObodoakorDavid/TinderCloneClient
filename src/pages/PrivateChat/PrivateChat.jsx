import React, { useEffect, useState } from "react";
import useChat from "../../hooks/useChat";
import { useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import chatService from "../../service/chatService";

const PrivateChat = () => {
  const { chatId } = useParams();
  const [input, setInput] = useState("");
  const [isLaoding, setIsLoading] = useState(true);
  const { socket } = useChat();
  const { user } = useAuth();

  const [chatMessages, setChatMessages] = useState(null);
  const [recipientId, setRecipientId] = useState(null);

  useEffect(() => {
    const retrieveChatMessages = async () => {
      const chat = await chatService.getChatMessages({
        chatId,
      });
      setIsLoading(false);

      if (chat) {
        console.log(chat.messages);
        setChatMessages(chat.messages);
        setRecipientId(chat.members.find((member) => member !== user.id));
      }
    };
    if (chatId) {
      retrieveChatMessages();
    }
  }, []);

  useEffect(() => {
    socket.on("getMessage", (incomingMessage) => {
      console.log(incomingMessage);
      setChatMessages((prevMessages) => [...prevMessages, incomingMessage]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket, setChatMessages]);

  if (isLaoding) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {chatMessages && chatMessages.length > 0 ? (
        chatMessages.map((message, i) => {
          console.log(message);
          console.log(message.sender._id === user.id);
          return (
            <div key={i}>
              <p
                className={`${
                  message?.sender._id == user.id ? "text-end" : "text-start"
                }`}
              >
                {message?.text}
              </p>
            </div>
          );
        })
      ) : (
        <p>Start Chatting</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // setMessages((prev) => [...prev, input]);
          chatService.sendMessage({
            text: input,
            sender: user.id,
            socket,
            recipientId,
            chatId,
          });
          setInput("");
        }}
        action=""
      >
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          className="w-100 mb-2"
        />
        <button className="w-100">send</button>
      </form>
    </div>
  );
};

export default PrivateChat;
