'use server'

import { cookies } from 'next/headers'
import { createToken, decodeToken } from '~/libs/jose'
import { resend } from '~/libs/resend'
import AuthEmail from '../../emails/auth'
import { getDomain } from './helpers/server'

export async function getMyIP() {
  return fetch('https://api.ipify.org?format=json')
    .then((res) => res.json())
    .then((res) => res.ip)
}

export async function getTokenData() {
  return decodeToken(cookies().get('token')?.value!)
}

export async function login(email: string) {
  const token = await createToken({ email })

  await resend.emails.send({
    to: [email],
    from: 'noreply@taskeven.com',
    subject: 'Login email',
    react: AuthEmail({ baseUrl: getDomain(), token }),
  })

  return true
}

export async function logout() {
  cookies().delete('token')
  return Promise.resolve(true)
}
