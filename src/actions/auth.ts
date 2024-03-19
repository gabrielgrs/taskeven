'use server'

import { cookies } from 'next/headers'
import { createToken } from '~/libs/jose'
import schemas, { UserSchema } from '~/libs/mongoose'
import { resend } from '~/libs/resend'
import { getTokenData } from '~/utils/auth'
import { parseObject } from './helpers'
import { getDomain } from './helpers/server'

export async function findUserOrCreate(email: string, values: Partial<UserSchema> = {}) {
  const user = await schemas.user.findOne({ email })
  if (user) return parseObject(user)
  const createdUser = await schemas.user.create({ ...values, email })
  return parseObject(createdUser)
}

export async function login(email: string) {
  const { _id, role } = await findUserOrCreate(email)

  const token = await createToken({ _id, email, role })

  await resend.emails.send({
    to: [email],
    from: 'noreply@taskeven.com',
    subject: 'Login email',
    html: `<a href="${getDomain()}/auth?token=${token}" target="_blank">Click here to login</a>`,
  })

  return true
}

export async function getAuthenticatedUser() {
  const decodedToken = await getTokenData()
  if (!decodedToken) return null

  const user = await schemas.user.findOne({ _id: decodedToken._id })
  return parseObject(user)
}

export async function logout() {
  cookies().delete('token')
  return Promise.resolve(true)
}
