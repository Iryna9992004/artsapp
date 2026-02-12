import { $apiEvent, $apiFetch } from "../axios";

export async function createEvent(
  title: string,
  event_description: string,
  user_id: number | string
) {
  try {
    const response = await $apiEvent.post("/events", {
      title,
      event_description,
      user_id: Number(user_id), // Конвертуємо в число для бекенду
    });
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function fetchEvents(
  offset: number,
  limit: number,
  searchText?: string
) {
  try {
    let response;
    if (searchText) {
      response = await $apiFetch.get(
        `/fetch/events/?limit=${limit}&offset=${offset}&searchText=${searchText}`
      );
    } else {
      response = await $apiFetch.get(
        `/fetch/events/?limit=${limit}&offset=${offset}`
      );
    }

    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
