import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  env: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    chatApiUrl: process.env.NEXT_PUBLIC_CHAT_API_URL,
    fetchApi: process.env.NEXT_PUBLIC_FETCH_API_URL,
    eventApi: process.env.NEXT_PUBLIC_EVENTS_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "png.pngtree.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
