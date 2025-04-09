/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "example.com",
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
