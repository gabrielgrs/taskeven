'use server'

import { createToken } from '@/libs/jose'
import { db } from '@/libs/mongoose'
import { sendEmail } from '@/libs/resend'
import { parseData } from '@/utils/actiont'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { createServerAction } from 'zsa'
import { authProcedure } from './procedures'

const usersAndCodes: Record<string, string> = {}

export const authWithEmail = createServerAction()
	.input(
		z.object({
			email: z.string().email(),
			name: z.string().optional(),
			code: z.string().optional(),
			terms: z.boolean(),
		}),
	)
	.handler(async ({ input: { email, name, code } }) => {
		const emailRegistered = await db.user.findOne({ email })

		if (!emailRegistered) {
			if (!name) return { needRegister: true }
			await db.user.create({ email, name })

			const code = Math.floor(Math.random() * 10000).toString()
			usersAndCodes[email] = code
			await sendEmail(email, `Your Taskeven code`, `<div>Your code is ${code}</div>`)
			return { codeSentToEmail: true, code }
		}

		if (emailRegistered) {
			if (code) {
				const foundCode = usersAndCodes[email]
				if (foundCode !== code) throw new Error('Invalid code')
				const cookiesData = await cookies()
				const createdToken = await createToken({
					_id: emailRegistered._id,
					email: emailRegistered.email,
					role: emailRegistered.role,
				})
				cookiesData.set('token', createdToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: true,
				})
				return { success: true }
			} else {
				const code = Math.floor(Math.random() * 10000).toString()
				usersAndCodes[email] = code
				await sendEmail(email, `Your Taskeven code`, `<div>Your code is ${code}</div>`)
				return { codeSentToEmail: true, code }
			}
		}

		throw new Error('Unauthorized')
	})

export const getAuthenticatedUser = authProcedure().handler(async ({ ctx }) => {
	return parseData(ctx.user)
})
