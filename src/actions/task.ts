'use server'

import { db } from '@/libs/mongoose'
import { parseData } from '@/utils/action'
import { z } from 'zod'
import { authProcedure } from './procedures'

export const createTask = authProcedure
	.input(
		z.object({
			title: z.string(),
			date: z.date().optional(),
			tags: z.array(z.string()),
		}),
	)
	.handler(async ({ input, ctx }) => {
		const data = await db.user.findOneAndUpdate({ email: ctx.user.email }, { $push: { tasks: [input] } })

		return parseData(data?.tasks.at(-1)!)
	})

export const updateTask = authProcedure
	.input(
		z.object({
			_id: z.string(),
			title: z.string().optional(),
			date: z.date().optional(),
			tags: z.array(z.string()),
		}),
	)
	.handler(async ({ input, ctx }) => {
		const data = await db.user.findOneAndUpdate(
			{ email: ctx.user.email, 'tasks._id': input._id },
			{ $set: { 'tasks.$': input } },
			{ new: true },
		)
		const updated = data?.tasks.find((x) => x._id.toString() === input._id)
		if (!updated) throw new Error('NOT_FOUND')
		return parseData(updated)
	})

export const removeTask = authProcedure
	.input(
		z.object({
			_id: z.string(),
		}),
	)
	.handler(async ({ input, ctx }) => {
		await db.user.findOneAndUpdate(
			{
				_id: ctx.user._id,
			},
			{ $pull: { tasks: { _id: input._id } } },
		)

		return true
	})
