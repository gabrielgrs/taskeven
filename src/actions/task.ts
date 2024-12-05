'use server'

import { db } from '@/libs/mongoose'
import { parseData } from '@/utils/actiont'
import { z } from 'zod'
import { authProcedure } from './procedures'

export const createTask = authProcedure()
	.input(
		z.object({
			title: z.string(),
			content: z.string().optional(),
			date: z.date().optional(),
			tags: z.array(z.string()),
		}),
	)
	.handler(async ({ input, ctx }) => {
		const data = await db.user.findOneAndUpdate({ email: ctx.user.email }, { $push: { tasks: [input] } })

		return parseData(data?.tasks.at(-1)!)
	})
