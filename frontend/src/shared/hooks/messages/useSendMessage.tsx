import { sendMessage } from "@/shared/api/services/messages.service";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export function useSendMessage(chat_id: number, user_id: number) {
  const [isLoading, setIsLoading] = useState(false);

  const send = async (text: string) => {
    if (!text || text.trim().length === 0) {
      return;
    }
    
    setIsLoading(true);
    try {
      await sendMessage(text, chat_id, user_id);
      // Успішно відправлено - форма вже очищена в submit функції
    } catch (e) {
      console.error("Error sending message:", e);
      const errorMessage = e instanceof Error ? e.message : "Error sending message";
      toast.error(errorMessage);
      // Не скидаємо isLoading тут, щоб форма залишалася disabled тільки під час спроби відправки
    } finally {
      // Завжди скидаємо isLoading, навіть якщо була помилка
      setIsLoading(false);
    }
  };
  return { isLoading, send };
}
