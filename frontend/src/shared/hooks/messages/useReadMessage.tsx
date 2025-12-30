import { readMessage } from "@/shared/api/services/messages.service";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export function useReadMessage() {
  const [isLoading, setIsLoading] = useState(false);

  const read = async (message_id: number, user_id: number) => {
    setIsLoading(true);
    try {
      await readMessage(message_id, user_id);
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.message);
      }
      toast.error("Error reading message");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, read };
}
