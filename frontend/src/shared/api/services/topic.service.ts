import { $apiChat, $apiFetch } from "../axios";

export async function createTopicService(text: string, user_id: string) {
  try {
    const response = await $apiChat.post("/chat/create", { text, user_id });
    return response.data;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchTopics(
  offset: number,
  limit: number,
  searchText?: string
) {
  try {
    if (searchText) {
      const response = await $apiFetch.get(
        `/fetch/topic/?limit=${limit}&offset=${offset}&searchText=${searchText}`
      );
      return response.data;
    } else {
      const response = await $apiFetch.get(
        `/fetch/topic/?limit=${limit}&offset=${offset}`
      );
      return response.data;
    }
  } catch (e) {
    console.error(e);
  }
}
