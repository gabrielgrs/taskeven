'use server'

import { db } from '@/libs/mongoose'
import { parseData } from '@/utils/action'
import { z } from 'zod'
import { authProcedure } from './procedures'

export const getTasks = authProcedure.handler(async ({ ctx }) => {
	const tasks = await db.task.find({ $or: [{ email: ctx.email }, { ip: ctx.ip }] })

	return parseData(tasks)
})

export const createTask = authProcedure
	.input(
		z.object({
			title: z.string(),
			date: z.date().optional(),
			tags: z.array(z.string()),
		}),
	)
	.handler(async ({ input, ctx }) => {
		const data = await db.task.create({
			...input,
			email: ctx.email,
			ip: ctx.ip,
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
			{ $and: [{ _id: input._id }, { $or: [{ email: ctx.email }, { ip: ctx.ip }] }] },
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
			tags: z.array(z.string()),
		}),
	)
	.handler(async ({ input, ctx }) => {
		const data = await db.task.findOneAndUpdate(
			{ $and: [{ _id: input._id }, { $or: [{ email: ctx.email }, { ip: ctx.ip }] }] },
			{ title: input.title, date: input.date, tags: input.tags },
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
		await db.task.findOneAndDelete({ $and: [{ _id: input._id }, { $or: [{ email: ctx.email }, { ip: ctx.ip }] }] })

		return true
	})
