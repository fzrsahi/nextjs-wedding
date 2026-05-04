import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  allowedDevOrigins: [
    "localhost:3000",
    "*.ngrok-free.app",
    "07ea-2001-448a-7065-1323-e4ea-433f-dd77-f8d9.ngrok-free.app",
  ],
};

export default nextConfig;
