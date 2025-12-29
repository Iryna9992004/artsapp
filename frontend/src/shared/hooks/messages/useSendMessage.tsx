import { sendMessage } from "@/shared/api/services/messages.service";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export function useSendMessage(chat_id: number, user_id: number) {
  const [isLoading, setIsLoading] = useState(false);

  const send = async (text: string) => {
    setIsLoading(true);
    try {
      await sendMessage(text, chat_id, user_id);
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.message);
      }
      toast.error("Error sending message");
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, send };
}
