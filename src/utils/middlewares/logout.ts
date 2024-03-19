import { NextRequest, NextResponse } from 'next/server'

export async function logoutMiddleware(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url))
  response.cookies.delete('token')
  return response
}
