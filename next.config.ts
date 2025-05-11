import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // Add 'localhost' to allow loading images from this domain
  },
};

export default nextConfig;
