const withPWA = require('next-pwa')

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      { hostname: 'rh8ercatworoxn57.public.blob.vercel-storage.com' },
      { hostname: 'lh3.googleusercontent.com' },
    ],
  },
  ...withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
  }),
}

module.exports = nextConfig
