import axiosInstance from "../utils/axiosConfig";

const sendMessage = async ({ sender, text, socket, recipientId, chatId }) => {
  try {
    const { data } = await axiosInstance.post(`/api/chat/${chatId}`, {
      sender,
      text,
    });
    console.log(data.message);
    socket.emit("sendMessage", { ...data.message, recipientId, chatId });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const startChat = async (participants, token) => {
  try {
    const { data } = await axiosInstance.post(`/api/chat`, {
      participants,
    });

    console.log(data);
    return data.chat._id;
  } catch (error) {
    console.error("Error starting chat:", error);
  }
};

const getUserChats = async ({ token }) => {
  try {
    const { data } = await axiosInstance.get(`/api/chat/`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : null,
      },
    });
    console.log(data.chats);
    return data.chats;
  } catch (error) {
    console.error("Error getting user chats:", error);
  }
};

const getChatMessages = async ({ chatId, token }) => {
  try {
    const { data } = await axiosInstance.get(`/api/chat/${chatId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : null,
      },
    });
    // console.log(data.chat);
    return data.chat;
  } catch (error) {
    console.error("Error getting chat messages:", error);
  }
};

export default { startChat, sendMessage, getUserChats, getChatMessages };
