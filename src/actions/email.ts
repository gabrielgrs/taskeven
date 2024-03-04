'use server'

import { resend, sendEmail } from '~/lib/resend'

export async function sendContactEmail(name: string, email: string, message: string) {
  return sendEmail(
    'grxgabriel@gmail.com',
    'Contact',
    `<div><strong>Name</strong>: ${name} <br/> 
            <strong>Email:</strong> ${email}\n <br/> 
            <strong>Message:</strong> ${message}
      </div>`,
  )
}

export async function sendErrorEmail(error: any) {
  return resend.emails.send({
    from: 'noreply@taskeven.com',
    to: ['grxgabriel@gmail.com'],
    subject: 'Error',
    html: error,
  })
}
