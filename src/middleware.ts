import { NextRequest, NextResponse } from 'next/server'

function getToken(req: NextRequest) {
  const urlSearchParams = new URLSearchParams(req.nextUrl.search)
  return urlSearchParams.get('token') || req.cookies.get('token')?.value
}

export async function middleware(req: NextRequest) {
  const token = getToken(req)

  if (req.url.includes('/logout')) {
    const response = NextResponse.redirect(new URL('/', req.url))
    response.cookies.delete('token')
    return response
  }

  if (req.url.includes('/auth') && token) {
    const response = NextResponse.redirect(new URL('/app', req.url))
    response.cookies.set('token', token)
    return response
  }

  const response = NextResponse.next()
  if (token) response.cookies.set('token', token)

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|assets|icons).*)'],
}
