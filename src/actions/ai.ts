'use server'

import { timeValueToMinutes } from '@/utils/date'
import OpenAI from 'openai'
import { z } from 'zod'
import { authProcedure } from './procedures'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_KEY,
})

export const generateInsight = authProcedure
	.input(
		z.object({
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

		const completion = await openai.chat.completions.create({
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

		return completion.choices[0].message.content
	})
