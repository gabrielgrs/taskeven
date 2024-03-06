import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

type TokenData = {
  _id: string
}

export const decodeToken = (token: string) => jwt.verify(token, process.env.JWT_SECRET) as Promise<TokenData>

export const createToken = (data: TokenData, expiresIn?: string) =>
  expiresIn ? jwt.sign(data, process.env.JWT_SECRET, { expiresIn }) : jwt.sign(data, process.env.JWT_SECRET)

export const getTokenData = () => {
  try {
    const token = cookies().get('token')?.value
    if (!token) return null
    return jwt.verify(token, process.env.JWT_SECRET) as TokenData
  } catch {
    return null
  }
}
