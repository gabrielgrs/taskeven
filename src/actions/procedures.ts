import { decodeToken } from '@/libs/jose'
import { db } from '@/libs/mongoose'
import { cookies, headers } from 'next/headers'
import { createServerActionProcedure } from 'zsa'

export const authProcedure = createServerActionProcedure()
	.handler(async (): Promise<{ paid: boolean; ip: string; email?: string }> => {
		const headersData = await headers()
		const cookieData = await cookies()

		const ip = headersData.get('x-forwarded-for')
		if (!ip) throw new Error('IP is required')
		const token = cookieData.get('token')?.value

		if (!token) {
			return {
				paid: false,
				ip,
			}
		}

		const tokenData = await decodeToken(token)

		if (!tokenData) {
			return {
				paid: false,
				ip,
			}
		}

		const paidTask = await db.task.find({
			email: tokenData.email,
			paid: true,
		})
		const paid = paidTask.length > 0

		return {
			paid,
			ip,
			email: tokenData.email,
		}
	})
	.createServerAction()
