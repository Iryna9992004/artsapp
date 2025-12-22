import { $apiChat } from "../axios";

export async function createTopicService(text: string, user_id: string) {
  try {
    const response = await $apiChat.post("/chat/create", { text, user_id });
    console.log("Create Topic Response:", response.data);
    return response.data;
  } catch (e) {
    console.error(e);
  }
}
