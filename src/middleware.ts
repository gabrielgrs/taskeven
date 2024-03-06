import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const urlSearchParams = new URLSearchParams(req.nextUrl.search)
  const tokenParam = urlSearchParams.get('token')
  if (tokenParam) {
    const response = NextResponse.redirect(new URL('/', req.url))
    response.cookies.set('token', tokenParam)
    return response
  }

  const response = NextResponse.next()
  const token = req.cookies.get('token')?.value
  if (token) response.cookies.set('token', token)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|assets|icons).*)'],
}
