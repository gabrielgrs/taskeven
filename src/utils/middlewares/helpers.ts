import { NextRequest } from 'next/server'

export function getMiddlewareToken(request: NextRequest) {
  const urlSearchParams = new URLSearchParams(request.nextUrl.search)
  return urlSearchParams.get('token') || request.cookies.get('token')?.value
}
