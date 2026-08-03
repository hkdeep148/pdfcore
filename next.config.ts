import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',           // Generates static HTML files for Cloudflare
  trailingSlash: true,        // Adds trailing slashes for better routing
  images: {
    unoptimized: true,        // Required for static export
  },
  turbopack: {
    // Support WASM files (required for jSquash)
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json', '.wasm'],
  },
};

export default nextConfig;