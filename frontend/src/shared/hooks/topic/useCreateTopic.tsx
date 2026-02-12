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
        // Mark that we just created a topic (for refresh trigger)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('topicCreated', Date.now().toString());
        }
        // Add delay to allow replication from PostgreSQL to ClickHouse
        // ClickHouse replication usually takes 1-2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Navigate to feed without any query params
        router.replace('/feed');
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
