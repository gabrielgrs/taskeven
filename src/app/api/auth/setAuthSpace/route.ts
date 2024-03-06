import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createToken, decodeToken } from '~/lib/jwt'

export async function POST(req: NextRequest) {
  const cookiesToken = cookies().get('auth-token')?.value
  if (!cookiesToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { spaceId } = await req.json()

  const decodedToken = await decodeToken(cookiesToken)

  const token = createToken({
    identifier: decodedToken.identifier,
    spaces: [...decodedToken.spaces, spaceId],
  })

  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
  })

  return NextResponse.json(token, { status: 200 })
}
