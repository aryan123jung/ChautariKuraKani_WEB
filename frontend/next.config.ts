// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from 'next'

const backendURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6060";
const IsDEV = backendURL.startsWith("http://localhost");

const config: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    dangerouslyAllowLocalIP: IsDEV,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "6060",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default config;
