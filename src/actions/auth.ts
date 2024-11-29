'use server'

import { z } from 'zod'
import { createServerAction } from 'zsa'

export const authWithEmail = createServerAction()
	.input(
		z.object({
			email: z.string().email(),
			name: z.string().optional(),
			code: z.string().optional(),
			terms: z.boolean().optional(),
		}),
	)
	.handler(async ({ input }) => {
		if (!input.code) {
			const emailAlreadyRegistered = input.email === 'grxgabriel@gmail.com'

			if (!emailAlreadyRegistered && !input.name) throw new Error('NOT_FOUND')

			const code = Math.floor(Math.random() * 10000)
			return { codeSentToEmail: true, code }
		}

		if (input.email === 'grxgabriel@gmail.com' && input.code === '1234') {
			return { success: true }
		}

		throw new Error('UNAUHTHORIZED')
	})
