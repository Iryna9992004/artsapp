import { createTopicService } from "@/shared/api/services/topic.service";
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
        router.push('/feed');
        router.refresh();
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
