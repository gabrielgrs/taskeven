import { Resend } from 'resend'

const resendClient = new Resend(process.env.RESEND_KEY)

export const sendEmail = (to: string, subject: string, html: string) =>
	resendClient.emails.send({
		from: 'noreply@sendfy.dev',
		to,
		subject,
		html,
	})
