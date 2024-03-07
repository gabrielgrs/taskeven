'use server'

import { cookies } from 'next/headers'
import { createToken, decodeToken } from '~/lib/jwt'
import schemas, { UserSchema } from '~/lib/mongoose'
import { resend } from '~/lib/resend'
import { parseObject } from './helpers'
import { getDomain } from './helpers/server'

export async function findUserOrCreate(email: string, values: Partial<UserSchema> = {}) {
  const user = await schemas.user.findOne({ email })
  if (user) return parseObject(user)
  const createdUser = await schemas.user.create({ ...values, email })
  return parseObject(createdUser)
}

export async function login(email: string) {
  const { _id } = await findUserOrCreate(email)

  const token = createToken({ _id })

  await resend.emails.send({
    to: [email],
    from: 'noreply@taskeven.com',
    subject: 'Login email',
    text: `Click here to login: ${getDomain()}/auth?token=${token}`,
  })

  return true
}

export async function getAuthenticatedUser() {
  const token = cookies().get('token')?.value
  if (!token) return null
  const { _id } = await decodeToken(token)

  const user = await schemas.user.findOne({ _id })
  return parseObject(user)
}

export async function logout() {
  cookies().delete('token')
  return Promise.resolve(true)
}
