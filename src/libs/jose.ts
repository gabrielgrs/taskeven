import * as jose from 'jose'
import { cookies } from 'next/headers'

export type TokenData = { email: string }

export async function decodeToken(token: string) {
	return jose
		.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
		.then((res) => res.payload as TokenData)
		.catch(() => null)
}

export async function createToken(data: TokenData) {
	return new jose.SignJWT(data)
		.setProtectedHeader({ alg: 'HS256' })
		.sign(new TextEncoder().encode(process.env.JWT_SECRET))
}

export async function getTokenData() {
	const cookiesData = await cookies()
	return decodeToken(cookiesData.get('token')?.value!)
}
