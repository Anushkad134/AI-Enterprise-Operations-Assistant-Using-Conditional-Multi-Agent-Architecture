import { useState } from "react";
import { sendChatMessage } from "../services/api";


export function useChat() {

  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);


  const sendMessage = async (message) => {

    const cleanMessage = message.trim();

    if (!cleanMessage || loading) {
      return;
    }


    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: cleanMessage,
      },
    ]);


    setInput("");
    setLoading(true);


    try {

      const data = await sendChatMessage(
        cleanMessage,
        chatHistory
      );


      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.message,
          category: data.category,
        },
      ]);


      setChatHistory(data.chat_history);

    } catch (error) {

      console.error("Chat API error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "I couldn't connect to the Operations Assistant. Please make sure the backend is running and try again.",
          category: null,
        },
      ]);

    } finally {

      setLoading(false);

    }
  };


  const clearChat = () => {

    setMessages([]);
    setChatHistory([]);
    setInput("");

  };


  return {
    messages,
    chatHistory,
    input,
    setInput,
    loading,
    sendMessage,
    clearChat,
  };
}
