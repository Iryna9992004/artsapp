import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  env: {
    // Використовуємо один backend URL для всіх API
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    chatApiUrl: process.env.NEXT_PUBLIC_API_URL, // Тепер використовуємо той самий URL
    fetchApi: process.env.NEXT_PUBLIC_API_URL,  // Тепер використовуємо той самий URL
    eventApi: process.env.NEXT_PUBLIC_API_URL,  // Тепер використовуємо той самий URL
    postApi: process.env.NEXT_PUBLIC_API_URL,  // Тепер використовуємо той самий URL
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
