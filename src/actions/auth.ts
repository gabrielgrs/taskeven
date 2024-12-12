'use server'

import { createToken } from '@/libs/jose'
import { db } from '@/libs/mongoose'
import { sendEmail } from '@/libs/resend'
import { createOrFindCustomerByEmail } from '@/libs/stripe/utils'
import { parseData } from '@/utils/action'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { createServerAction } from 'zsa'
import { authProcedure } from './procedures'

async function createOrFindUser(email: string) {
	const user = await db.user.findOne({ email })
	if (user) return user

	const stripeCustomer = await createOrFindCustomerByEmail(email)
	return db.user.create({
		email: email,
		stripeCustomerId: stripeCustomer.id,
	})
}

export const authenticate = createServerAction()
	.input(z.object({ email: z.string(), code: z.string().optional() }))
	.handler(async ({ input }): Promise<{ status: 'AUTHORIZED' | 'WAITING_FOR_CODE' }> => {
		const user = await createOrFindUser(input.email)

		if (!input.code) {
			const generatedCode = Math.floor(100000 + Math.random() * 900000).toString()
			await db.session.create({ email: user.email, code: generatedCode })

			await sendEmail(input.email, 'Verification Code', `Your verification code is: <strong>${generatedCode}</strong>`)
			return {
				status: 'WAITING_FOR_CODE',
			}
		}

		const isValidCode = await db.session.findOne({ email: input.email, code: input.code })

		if (!isValidCode) throw new Error('Unauthorized')

		const token = await createToken({
			_id: user._id,
			role: user.role,
		})

		const cookiesData = await cookies()

		cookiesData.set('token', token, {
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
			secure: process.env.NODE_ENV === 'production',
		})

		return {
			status: 'AUTHORIZED',
		}
	})

export const getAuthenticatedUser = authProcedure.handler(async ({ ctx }) => {
	return parseData(ctx.user)
})

export const signOut = createServerAction().handler(async () => {
	const cookiesData = await cookies()

	cookiesData.delete('token')

	return true
})

export const updateUser = authProcedure
	.input(z.object({ startTime: z.string().optional(), endTime: z.string().optional() }))
	.handler(async ({ ctx, input }) => {
		await db.user.findOneAndUpdate({ _id: ctx.user._id }, input)

		return true
	})
