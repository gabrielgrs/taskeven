import { NextRequest, NextResponse } from 'next/server'
import { decodeToken } from '~/libs/jose'
import { getMiddlewareToken } from './helpers'

export async function authMiddleware(request: NextRequest) {
  try {
    const token = getMiddlewareToken(request) || ''
    const tokenData = await decodeToken(token)
    if (!tokenData) throw Error('Unauthorized access')
    const response = NextResponse.redirect(new URL('/spaces', request.url))
    response.cookies.set('token', token)
    return response
  } catch (error) {
    const response = NextResponse.next()
    response.cookies.delete('token')
    return response
  }
}
