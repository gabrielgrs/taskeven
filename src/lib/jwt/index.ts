import jwt from 'jsonwebtoken'

type TokenData = {
  identifier: string
}

export const decodeToken = (token: string) => jwt.verify(token, process.env.JWT_SECRET) as Promise<TokenData>

export const createToken = (data: TokenData, expiresIn?: string) =>
  expiresIn ? jwt.sign(data, process.env.JWT_SECRET, { expiresIn }) : jwt.sign(data, process.env.JWT_SECRET)
