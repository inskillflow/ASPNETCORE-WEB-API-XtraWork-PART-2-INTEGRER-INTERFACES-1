/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL || 'https://localhost:7033/api',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:7033/api/:path*',
      },
    ];
  },
};

export default nextConfig;

