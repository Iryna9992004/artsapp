import axios from "axios";

export const $api = axios.create({
  baseURL: process.env.apiUrl,
});

export const $apiChat = axios.create({
  baseURL: process.env.chatApiUrl,
});

export const $apiEvent = axios.create({
  baseURL: process.env.eventApi,
});

export const $apiFetch = axios.create({
  baseURL: process.env.fetchApi,
});
