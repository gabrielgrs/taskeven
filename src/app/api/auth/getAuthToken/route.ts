import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { createToken } from '~/lib/jwt'

export async function GET() {
  const cookiesToken = cookies().get('auth-token')
  if (cookiesToken) return NextResponse.json(cookiesToken, { status: 200 })

  const token = await createToken({ identifier: new Types.ObjectId().toString(), spaces: [] })

  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
  })

  return NextResponse.json(token, { status: 200 })
}
