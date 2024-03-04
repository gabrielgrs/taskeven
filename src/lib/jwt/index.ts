import jwt from 'jsonwebtoken'
import { getCookie } from '~/utils/storage'
import { UserSchema } from '../mongoose'

export type TokenData = Pick<UserSchema, '_id' | 'email' | 'role'>

export const decodeToken = (token: string) => jwt.verify(token, process.env.JWT_SECRET) as Promise<TokenData>

export const createToken = (data: TokenData) => jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1d' })

export const getTokenData = (tokenParam?: string) => {
  try {
    const token = getCookie('token') || tokenParam
    if (!token) throw Error('Required token')
    return decodeToken(token)
  } catch {
    return null
  }
}
