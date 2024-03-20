import * as jose from 'jose'

export type TokenData = { email: string }

export const decodeToken = async (token: string) => {
  return jose
    .jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    .then((res) => res.payload as TokenData)
    .catch(() => null)
}

export const createToken = async (data: TokenData, expirationTime = '24h') => {
  return new jose.SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expirationTime)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET))
}
