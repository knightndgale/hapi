/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "example.com",
      },
      {
        hostname: "localhost",
      },
      {
        hostname: "directus-production-8483.up.railway.app",
      },
      {
        hostname: "hapi.j9apyz9bfea84.ap-southeast-1.cs.amazonlightsail.com",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "i.ibb.co",
      },
      {
        hostname: "picsum.photos",
      },
    ],
  },
};

module.exports = nextConfig;
