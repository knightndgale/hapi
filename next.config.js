/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["example.com", "images.unsplash.com", "i.ibb.co", "picsum.photos"],
  },
};

module.exports = nextConfig;
