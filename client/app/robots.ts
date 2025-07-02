import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // disallow: '/dashboard/', // For private pages
    },
    sitemap: 'https://bimalxshorten.vercel.app/sitemap.xml',
  }
}