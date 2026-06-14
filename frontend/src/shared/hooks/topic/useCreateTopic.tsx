import { createTopicService } from "@/shared/api/services/topic.service";
import { PENDING_KEYS, setPendingItem } from "@/shared/lib/pendingItem";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export function useCreateTopic(user_id: number | undefined) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function createTopic(text: string) {
    if (!user_id) {
      toast.error("User ID is required");
      return;
    }
    setIsLoading(true);

    try {
      const response = await createTopicService(text, String(user_id));
      if (response) {
        toast.success("Topic was created successfully");
        // Оптимістично зберігаємо створену тему, щоб показати її у стрічці
        // одразу, не чекаючи асинхронної реплікації PostgreSQL → ClickHouse.
        const author_name =
          typeof window !== "undefined"
            ? localStorage.getItem("user_name") || ""
            : "";
        setPendingItem(PENDING_KEYS.topic, {
          ...response,
          author_name,
          reads_count: 0,
        });
        router.replace("/feed");
      }
      return response;
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message);
      }
      toast.error("Failed to create topic");
    } finally {
      setIsLoading(false);
    }
  }
  return { createTopic, isLoading };
}
