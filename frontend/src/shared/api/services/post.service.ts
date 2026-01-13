import { $apiPost, $apiFetch } from "../axios";

export async function createPost(
  title: string,
  post_description: string,
  user_id: number
) {
  try {
    const response = await $apiPost.post("/posts/create", {
      title,
      post_description,
      user_id,
    });
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function fetchPosts(
  limit: number,
  offset: number,
  searchText?: string
) {
  try {
    let response;
    if (searchText) {
      response = await $apiFetch.get(
        `/fetch/posts/?limit=${limit}&offset=${offset}&searchText=${searchText}`
      );
    } else {
      response = await $apiFetch.get(
        `/fetch/posts/?limit=${limit}&offset=${offset}`
      );
    }

    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

