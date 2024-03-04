import { MetadataRoute } from 'next'

const baseURL = 'https://taskeven.com'
const routes = ['/', '/contact', '/privacy-policy', '/terms-of-service']

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseURL}${route}`,
    lastModified: new Date(),
  }))
}
