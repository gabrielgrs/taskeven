import { NextRequest, NextResponse } from 'next/server'
import { getDomain } from '~/actions/helpers/server'
import { decodeToken } from '~/libs/jose'
import { getMiddlewareToken } from './helpers'

export async function authMiddleware(request: NextRequest) {
  try {
    const token = getMiddlewareToken(request) || ''
    const tokenData = await decodeToken(token)
    if (!tokenData) throw Error('Unauthorized access')

    await fetch(`${getDomain()}/api/space/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: tokenData.email }),
    })

    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set('token', token)
    return response
  } catch (error) {
    const response = NextResponse.next()
    response.cookies.delete('token')
    return response
  }
}
