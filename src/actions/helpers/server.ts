import { headers } from 'next/headers'

export function getDomain() {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const host = headers().get('host')
  return `${protocol}://${host}`
}
