// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.0.122:3001/:path*",
      },
    ];
  },
};

export default nextConfig;
