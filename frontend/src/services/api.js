import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

console.log("Backend API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendChatMessage = async (message, chatHistory) => {
  const response = await api.post("/chat", {
    message,
    chat_history: chatHistory,
  });

  return response.data;
};

export default api;