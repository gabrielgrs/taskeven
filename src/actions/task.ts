'use server'

import { db } from '@/libs/mongoose'
import { parseData } from '@/utils/action'
import { headers } from 'next/headers'
import { z } from 'zod'
import { authProcedure } from './procedures'

async function getIP() {
	const headersData = await headers()
	return headersData.get('x-forwarded-for') as string
}

export const getTasks = authProcedure.handler(async ({ ctx }) => {
	if (!ctx.user.stripeSubscriptionId) {
		const ip = await getIP()
		const tasks = await db.task.find({ user: ctx.user._id, ip })
		return parseData(tasks)
	}

	const tasks = await db.task.find({ user: ctx.user._id })

	return parseData(tasks)
})

export const createTask = authProcedure
	.input(
		z.object({
			title: z.string(),
			date: z.date().optional(),
			tag: z.string(),
			duration: z.number(),
		}),
	)
	.handler(async ({ input, ctx }) => {
		const ip = await getIP()

		const data = await db.task.create({
			...input,
			ip,
			user: ctx.user._id,
		})

		return parseData(data)
	})

export const onCompleteOrUncompleteTask = authProcedure
	.input(
		z.object({
			_id: z.string(),
			completed: z.boolean(),
		}),
	)
	.handler(async ({ input, ctx }) => {
		const data = await db.task.findOneAndUpdate(
			{ _id: input._id, user: ctx.user._id },
			{ completed: input.completed },
			{ new: true },
		)

		return parseData(data)
	})

export const updateTask = authProcedure
	.input(
		z.object({
			_id: z.string(),
			title: z.string().optional(),
			date: z.date().optional(),
			tag: z.string(),
			duration: z.number(),
		}),
	)
	.handler(async ({ input, ctx }) => {
		const data = await db.task.findOneAndUpdate(
			{ _id: input._id, user: ctx.user._id },
			{ title: input.title, date: input.date, tag: input.tag, duration: input.duration },
			{ new: true },
		)

		return parseData(data)
	})

export const removeTask = authProcedure
	.input(
		z.object({
			_id: z.string(),
		}),
	)
	.handler(async ({ input, ctx }) => {
		await db.task.findOneAndDelete({ _id: input._id, user: ctx.user._id })

		return true
	})
