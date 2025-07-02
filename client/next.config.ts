/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['bimalxshorten.vercel.app'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  compress: true,
}

module.exports = nextConfig