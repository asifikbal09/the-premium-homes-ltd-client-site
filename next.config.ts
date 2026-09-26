import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thepremiumhomesltd.com",
      },
      {
        protocol: "https",
        hostname: "api.dpremiumhomes.com",
      },
      {
        protocol: "http",
        hostname: "api.dpremiumhomes.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
