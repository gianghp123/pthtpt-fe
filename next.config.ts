import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/seats',
        destination: 'http://localhost:3000/seat', // Map /seats to /seat
      },
      {
        source: '/api/seats/:path*',
        destination: 'http://localhost:3000/seat/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/:path*', // Proxy other requests
      },
    ];
  },
};

export default nextConfig;
