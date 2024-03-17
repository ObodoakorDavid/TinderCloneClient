/** @format */

import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";
import chatService from "../service/chatService";

const ChatContext = createContext();

export default ChatContext;

export const ChatProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  const [chats, setChats] = useState(null);

  useEffect(() => {
    const retrieveChats = async () => {
      const chats = await chatService.getUserChats({ token });
      setChats(chats);
    };

    retrieveChats();
  }, []);

  useEffect(() => {
    if (newMessage == null) {
      return;
    }

    console.log("newwwwww");

    const newChats = chats.map((chat) => {
      if (chat.chatId === newMessage.chatId) {
        return {
          ...chat,
          lastMessage: {
            ...chat.lastMessage,
            sender: newMessage.sender,
            text: newMessage.text,
          },
        };
      } else {
        return chat;
      }
    });

    console.log(newChats);
    setChats(newChats);
  }, [newMessage]);

  useEffect(() => {
    if (socket === null) {
      return;
    }
    socket.on("getMessage", (incomingMessage) => {
      setNewMessage(incomingMessage);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket]);

  useEffect(() => {
    const socket = io("http://localhost:4000");
    setSocket(socket);
    setIsConnected(true);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket === null || user === null) {
      return;
    }

    socket.emit("addNewUser", user.id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res.filter((eachUser) => eachUser.userId !== user.id));
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, user]);

  const contextData = {
    isConnected,
    onlineUsers,
    socket,
    chats,
  };
  return (
    <ChatContext.Provider value={contextData}>{children}</ChatContext.Provider>
  );
};
