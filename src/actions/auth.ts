'use server'

import { decodeToken } from '~/lib/jwt'
import { getDomain } from './helpers/server'

export async function getAuthenticatedUser() {
  const domain = getDomain()

  const response = await fetch(`${domain}/api/auth/getAuthToken`)

  if (!response.ok) throw Error('Something went wrong')

  const token = await response.json()

  return decodeToken(token)
}
