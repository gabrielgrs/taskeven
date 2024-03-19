import { NextRequest } from 'next/server'
import { authMiddleware } from './utils/middlewares/auth'
import { logoutMiddleware } from './utils/middlewares/logout'
import { sharedMiddleware } from './utils/middlewares/shared'

export async function middleware(request: NextRequest) {
  if (request.url.includes('/logout')) {
    return logoutMiddleware(request)
  }

  if (request.url.includes('/auth')) {
    return authMiddleware(request)
  }

  return sharedMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|assets|icons).*)'],
}
