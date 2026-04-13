/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: 'kifaru-server.onrender.com' },
      { protocol: 'https', hostname: 'kifarugroup.co.tz' },
    ],
  },
}
module.exports = nextConfig