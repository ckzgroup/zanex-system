/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Ignore TypeScript errors during Vercel production builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Ignore ESLint errors during Vercel production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "62.12.114.16",
        port: "",
      },
      {
        protocol: "https",
        hostname: "qtask-v3-service.qtask.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "repository.qtask.net",
        port: "",
      },
    ],
  },
};

export default nextConfig;
