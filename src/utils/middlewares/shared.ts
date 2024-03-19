import { NextRequest, NextResponse } from 'next/server'
import { getMiddlewareToken } from './helpers'

export async function sharedMiddleware(request: NextRequest) {
  const response = NextResponse.next()
  const token = getMiddlewareToken(request)
  if (token) response.cookies.set('token', token)
  return response
}
