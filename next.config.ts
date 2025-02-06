import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'export',
  reactStrictMode: false,
  images: {
    remotePatterns: [ // 이미지 서버 추가
      {
        protocol: "http",
        hostname: "localhost"
      }
    ]
  }
};

export default nextConfig;
