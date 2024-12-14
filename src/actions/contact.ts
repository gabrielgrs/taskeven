'use server'

import { sendEmail } from '@/libs/resend'
import { z } from 'zod'
import { createServerAction } from 'zsa'

export const sendContactMessage = createServerAction()
	.input(z.object({ email: z.string(), message: z.string() }))
	.handler(async ({ input }) => {
		return sendEmail(
			'grxgabriel@gmail.com',
			'Contact Form',
			`<p>From ${input.email}, <br/> message: ${input.message}</p>`,
		)
	})
