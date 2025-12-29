import { socket } from "@/shared/api/socket";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Message {
  id: number;
  text: string;
  topic_id: string;
  user_id: string;
}

export function useFetchMessages(chat_id: number) {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetch = async () => {
    setIsLoading(true);
    try {
      socket.emit(
        "get",
        {
          chat_id,
        },
        (res: { data: Message[] }) => {
          setMessages(res.data);
        }
      );
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.message);
      }
      toast.error("Error fetching messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();

    socket.on("message", (data: any) => {
      console.log("=--=received", data);
    });

    socket.on("messageRead", (data: any) => {
      console.log("=--=read", data);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return { isLoading, messages, fetch };
}
