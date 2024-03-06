'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Types } from 'mongoose'
import { createToken, decodeToken } from '~/lib/jwt'

export async function getUserIdentifier() {
  const token = cookies().get('token')?.value

  if (!token) {
    const createdToken = createToken({ identifier: new Types.ObjectId().toString() })
    return redirect(`/?token=${createdToken}`)
  }

  const decoded = await decodeToken(token)
  return decoded.identifier
}
