import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'export',
  reactStrictMode: false,
  images: {
    unoptimized: true,
    domains: ["tcat-front.site", "www.tcat-front.site"],
    remotePatterns: [ // 이미지 서버 추가
      {
        protocol: "http",
        hostname: "localhost"
      },
      {
        protocol: "https",
        hostname: "tcat-front.site"
      },
      {
        protocol: "https",
        hostname: "www.tcat-front.site"
      }
    ]
  }
};

export default nextConfig;
