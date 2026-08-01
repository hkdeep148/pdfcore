import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages configuration
  images: {
    unoptimized: true,  // Cloudflare doesn't need Next.js image optimization
  },
};

export default nextConfig;