import { createTopicService } from "@/shared/api/services/topic.service";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export function useCreateTopic(user_id: string) {
  async function createTopic(text: string) {
    try {
      const response = await createTopicService(text, user_id);
      console.log("Create Topic in Hook:", response);
      return response;
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message);
        toast.error("Failed to create topic");
      }
    }
  }
  return { createTopic };
}
