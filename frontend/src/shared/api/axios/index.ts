import axios from "axios";

export const $api = axios.create({
  baseURL: process.env.apiUrl,
});

export const $apiChat = axios.create({
  baseURL: process.env.chatApiUrl,
});
