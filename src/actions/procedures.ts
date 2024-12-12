import { createToken, decodeToken } from '@/libs/jose'
import { db } from '@/libs/mongoose'
import { parseData } from '@/utils/action'
import { cookies } from 'next/headers'
import { createServerActionProcedure } from 'zsa'

export const authProcedure = createServerActionProcedure()
	.handler(async () => {
		const cookiesData = await cookies()

		const token = cookiesData.get('token')?.value
		if (!token) throw new Error('Unauthorized')

		const tokenData = await decodeToken(token)
		if (!tokenData) throw new Error('Unauthorized')

		const user = await db.user.findOne({ _id: tokenData._id })
		if (!user) throw new Error('Unauthorized')

		const newToken = await createToken({ _id: user._id, role: user.role })

		cookiesData.set('token', newToken, {
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
			secure: process.env.NODE_ENV === 'production',
		})

		return parseData({ user: user.toJSON() })
	})
	.createServerAction()
