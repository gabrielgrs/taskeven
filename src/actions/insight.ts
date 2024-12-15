'use server'

import { db } from '@/libs/mongoose'
import { openaiClient } from '@/libs/openai'
import { parseData } from '@/utils/action'
import { timeValueToMinutes } from '@/utils/date'
import { z } from 'zod'
import { authProcedure } from './procedures'

export const generateInsight = authProcedure
	.input(
		z.object({
			date: z.date(),
			tasks: z.array(z.object({ title: z.string(), date: z.date().optional(), duration: z.number() })),
		}),
	)
	.handler(async ({ input, ctx }) => {
		const { name, startTime, endTime } = ctx.user

		const dailyCapacity = timeValueToMinutes(endTime) - timeValueToMinutes(startTime)

		const message = `
    ${name ? `User name is ${name}` : ''}
    ${dailyCapacity > 0 ? `Daily capacity is ${dailyCapacity}` : ''}
    ${input.tasks.reduce((acc: string, curr) => {
			acc += `${curr.title} ${curr.date ? `on ${curr.date}` : ''} ${curr.duration ? `for ${curr.duration}` : ''}\n`
			return acc
		}, '')}
    `

		const completion = await openaiClient.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: `You are a helpful assistant that helps me with insights of how improve my daily tasks. Try to generate with a max of 200 characters.`,
				},
				{
					role: 'user',
					content: message,
				},
			],
		})

		const data = await db.insight.create({
			user: ctx.user._id,
			date: input.date,
			content: completion.choices[0].message.content,
		})

		return data.content
	})

export const getInsights = authProcedure.handler(async ({ ctx }) => {
	const insights = await db.insight.find({ user: ctx.user._id }).sort({ date: -1 })

	return parseData(insights)
})
