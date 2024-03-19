import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_KEY)

export function sendEmail(to: string, subject: string, react: any) {
  return resend.emails.send({
    from: 'noreply@taskeven.com',
    to: [to],
    subject,
    react,
  })
}
