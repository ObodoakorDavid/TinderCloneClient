import React, { useEffect, useState } from "react";
import useChat from "../../hooks/useChat";
import { useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

const PrivateChat = () => {
  const { recipientId } = useParams();
  const [input, setInput] = useState("");
  const { messages, setMessages, socket, handleSendMessage } = useChat();
  const { token } = useAuth();

  useEffect(() => {
    const getMessages = async () => {
      const { data } = await axios.get(
        `http://localhost:4000/api/message/${recipientId}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : null,
          },
        }
      );
      console.log(data.messages);
      setMessages(
        data.messages.map((message) => ({
          text: message.text,
          sentBy: message.sentBy,
        }))
      );
    };
    getMessages();
  }, []);

  console.log(messages);
  return (
    <div>
      {messages.map((message, i) => {
        return <p key={i}>{message.text}</p>;
      })}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // setMessages((prev) => [...prev, input]);
          handleSendMessage(recipientId, input);
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
