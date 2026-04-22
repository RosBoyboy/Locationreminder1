import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/das',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
