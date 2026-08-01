import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',           // Enables static export
  trailingSlash: true,        // Makes URLs work on Apache
  images: {
    unoptimized: true,        // Required for static export
  },
};

export default nextConfig;