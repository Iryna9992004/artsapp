import { createTopicService } from "@/shared/api/services/topic.service";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export function useCreateTopic(user_id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function createTopic(text: string) {
    setIsLoading(true);

    try {
      const response = await createTopicService(text, user_id);
      if (response) {
        toast.success("Topic was created successfully");
        router.back();
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
