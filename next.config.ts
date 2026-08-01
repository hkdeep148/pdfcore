import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',           // Generates static HTML files for Cloudflare
  trailingSlash: true,        // Adds trailing slashes for better routing
  images: {
    unoptimized: true,        // Required for static export
  },
};

export default nextConfig;