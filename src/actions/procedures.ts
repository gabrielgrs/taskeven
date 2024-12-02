import { cookies } from 'next/headers'
import { createServerActionProcedure } from 'zsa'

export const authProcedure = createServerActionProcedure()
	.handler(async () => {
		const cookiesData = await cookies()
		const token = cookiesData.get('token')?.value

		if (!token) throw new Error('UNAUTHORIZED')
		return {
			success: true,
		}
	})
	.createServerAction()
