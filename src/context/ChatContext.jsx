/** @format */

import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const ChatContext = createContext();

export default ChatContext;

export const ChatProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [messages, setMessages] = useState([]);

  // sending a message
  const handleSendMessage = async (recipientId, newMessage) => {
    if (!socket) {
      return;
    }

    const { data } = await axios.post(
      `http://localhost:4000/api/message/${recipientId}`,
      { text: newMessage },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
        },
      }
    );

    console.log(data);
    socket.emit("sendMessage", { text: newMessage, sentBy: recipientId });
  };

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket);
    setIsConnected(true);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log(user);
    console.log(socket);
    if (socket === null || user === null) {
      return;
    }
    console.log(user);

    socket.emit("addNewUser", user.id);
    socket.on("getOnlineUsers", (res) => {
      console.log(res);
      setOnlineUsers(res.filter((eachUser) => eachUser.userId !== user.id));
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, user]);

  // receive Message
  useEffect(() => {
    if (socket === null) {
      return;
    }

    socket.on("getMessage", (res) => {
      console.log(res);
      setMessages((prev) => [...prev, res]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket]);

  const contextData = {
    isConnected,
    onlineUsers,
    messages,
    setMessages,
    socket,
    handleSendMessage,
  };
  return (
    <ChatContext.Provider value={contextData}>{children}</ChatContext.Provider>
  );
};
