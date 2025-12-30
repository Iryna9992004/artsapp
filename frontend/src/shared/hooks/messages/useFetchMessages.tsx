import { socket } from "@/shared/api/socket";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Message {
  id: number;
  text: string;
  topic_id: string;
  user_id: string;
  author_name: string;
  reads_count: string;
  created_at: string;
}

interface MessageRead {
  user_id: number;
  message_id: number;
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

    const handleNewMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    const handleMessageRead = (data: MessageRead | null) => {
      if (!data || !data.message_id) {
        return;
      }

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === data.message_id) {
            const currentCount = Number(msg.reads_count) || 0;
            return { ...msg, reads_count: String(currentCount + 1) };
          }
          return msg;
        })
      );
    };

    socket.on("message", handleNewMessage);
    socket.on("messageRead", handleMessageRead);

    return () => {
      socket.off("message", handleNewMessage);
      socket.off("messageRead", handleMessageRead);
    };
  }, []);

  return { isLoading, messages, fetch };
}
