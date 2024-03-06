import jwt from 'jsonwebtoken'

type TokenData = {
  identifier: string
  spaces: string[]
}

export const decodeToken = (token: string) => jwt.verify(token, process.env.JWT_SECRET) as Promise<TokenData>

export const createToken = (data: TokenData) => jwt.sign(data, process.env.JWT_SECRET)
