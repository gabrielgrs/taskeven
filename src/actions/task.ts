'use server'

import { db } from '@/libs/mongoose'
import { parseData } from '@/utils/action'
import dayjs from 'dayjs'
import { z } from 'zod'
import { createServerAction } from 'zsa'
import { authProcedure } from './procedures'

export const getTasks = authProcedure.handler(async ({ ctx }) => {
	if (!ctx.user.stripeSubscriptionId) {
		const tasks = await db.task.find({ user: ctx.user._id, archived: false })
		return parseData(tasks)
	}

	const tasks = await db.task.find({ user: ctx.user._id })

	return parseData(tasks)
})

export const getMonthlyTasksCount = createServerAction()
	.input(z.object({ userId: z.string() }))
	.handler(async ({ input }) => {
		const totalTasks = await db.task.countDocuments({
			user: input.userId,
			archived: false,
			createdAt: {
				$gte: dayjs(new Date()).startOf('day').toDate(),
				$lt: dayjs(new Date()).endOf('day').toDate(),
			},
		})

		return totalTasks
	})

export const createTask = authProcedure
	.input(
		z.object({
			title: z.string(),
			date: z.date(),
			tag: z.string(),
			duration: z.number(),
		}),
	)
	.handler(async ({ input, ctx }) => {
		const [totalTasks, err] = await getMonthlyTasksCount({ userId: ctx.user._id })
		if (err) throw err

		if (totalTasks >= ctx.user.subscription.monlyTasks) {
			throw new Error('You have reached your montly task limit')
		}

		const data = await db.task.create({
			...input,
			user: ctx.user._id,
		})

		return parseData(data)
	})

export const archiveTask = authProcedure
	.input(
		z.object({
			_id: z.string(),
		}),
	)
	.handler(async ({ input, ctx }) => {
		const data = await db.task.findOneAndUpdate(
			{ _id: input._id, user: ctx.user._id },
			{ archived: true },
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
