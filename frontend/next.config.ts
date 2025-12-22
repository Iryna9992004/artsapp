import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  env: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    chatApiUrl: process.env.NEXT_PUBLIC_CHAT_API_URL,
  },
};

export default nextConfig;
