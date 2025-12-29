import { $apiEvent, $apiFetch } from "../axios";

export async function createEvent(
  title: string,
  event_description: string,
  user_id: string
) {
  try {
    const response = await $apiEvent.post("/events", {
      title,
      event_description,
      user_id,
    });
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function fetchEvents(
  limit: number,
  offset: number,
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
