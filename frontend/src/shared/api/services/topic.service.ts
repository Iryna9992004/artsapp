import { $apiChat, $apiFetch } from "../axios";

export async function createTopicService(text: string, user_id: string) {
  try {
    const response = await $apiChat.post("/chat/create", { text, user_id });
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function fetchTopics(
  offset: number,
  limit: number,
  searchText?: string
) {
  try {
    const url = searchText 
      ? `/fetch/topic/?limit=${limit}&offset=${offset}&searchText=${searchText}`
      : `/fetch/topic/?limit=${limit}&offset=${offset}`;
    
    console.log('Fetching topics from:', $apiFetch.defaults.baseURL + url);
    const response = await $apiFetch.get(url);
    console.log('Topics API response:', response.data);
    console.log('Response type:', typeof response.data, 'Is array:', Array.isArray(response.data));
    
    // Ensure we return an array
    const data = response.data;
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('Error fetching topics:', e);
    throw e;
  }
}
