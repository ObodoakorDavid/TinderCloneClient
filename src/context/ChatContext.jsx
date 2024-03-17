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
  const [isTyping, setIsTyping] = useState(false);

  const [chats, setChats] = useState(null);

  useEffect(() => {
    const retrieveChats = async () => {
      const chats = await chatService.getUserChats({ token });
      setChats(chats);
    };

    retrieveChats();
  }, []);

  useEffect(() => {
    if (!newMessage) {
      return;
    }

    console.log("New message received:", newMessage);

    const updatedChats = chats.map((chat) => {
      if (chat.chatId === newMessage.chatId) {
        return {
          ...chat,
          lastMessage: {
            ...chat.lastMessage,
            sender: newMessage.sender,
            text: newMessage.text,
          },
        };
      }
      return chat;
    });

    console.log("Updated chats:", updatedChats);
    setChats(updatedChats);
  }, [newMessage]);

  useEffect(() => {
    if (socket === null) {
      return;
    }
    socket.on("getMessage", (incomingMessage) => {
      console.log(incomingMessage);
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

  // adds new users, gets online users and tracks typing state
  useEffect(() => {
    if (socket === null || user === null) {
      return;
    }

    // adds new users
    socket.emit("addNewUser", user.id);

    //gets online users
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res.filter((eachUser) => eachUser.userId !== user.id));
    });

    // tracks typing state
    socket.on("isTyping", (data) => {
      console.log(data);
      setIsTyping(data);
    });

    return () => {
      socket.off("getOnlineUsers");
      socket.off("isTyping");
    };
  }, [socket, user]);

  const contextData = {
    isConnected,
    onlineUsers,
    socket,
    chats,
    setIsTyping,
    isTyping,
  };
  return (
    <ChatContext.Provider value={contextData}>{children}</ChatContext.Provider>
  );
};
