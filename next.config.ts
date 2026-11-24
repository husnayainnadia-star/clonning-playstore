import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Matikan cacheComponents agar bisa pakai dynamic routes normal
  cacheComponents: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "play-lh.googleusercontent.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.googleapis.com" },
      { protocol: "https", hostname: "**.github.com" },
      { protocol: "https", hostname: "**.imgur.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "**.utfs.io" },
    ],
  },
};

export default nextConfig;
