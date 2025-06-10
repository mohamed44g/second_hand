import axiosInstance from "./axiosInstance";

// بدء محادثة جديدة مع بائع
export const startNewChat = async (sellerId) => {
  const response = await axiosInstance.post("/chat/start", {
    seller_id: sellerId,
  });
  return response.data;
};

// جلب جميع المحادثات للمستخدم الحالي
export const fetchUserChats = async () => {
  const response = await axiosInstance.get("/chat");
  return response.data;
};

// جلب رسائل محادثة محددة
export const fetchChatMessages = async (chatId) => {
  const response = await axiosInstance.get(`/chat/${chatId}/messages`);
  return response.data;
};

export const fetchChatById = async (chatId) => {
  const response = await axiosInstance.get(`/chat/${chatId}`);
  return response.data;
};

// إرسال رسالة جديدة (للاستخدام بدون socket.io)
export const sendMessage = async (chatId, messageText) => {
  const response = await axiosInstance.post(`/chat/${chatId}/messages`, {
    message_text: messageText,
  });
  return response.data;
};
