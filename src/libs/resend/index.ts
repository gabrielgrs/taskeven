import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_KEY)

export const sendEmail = (to: string, subject: string, html: string) =>
	resend.emails.send({
		from: 'noreply@sendfy.dev',
		to,
		subject,
		html,
	})
