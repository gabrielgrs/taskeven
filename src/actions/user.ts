'use server'

import { db } from '@/libs/mongoose'
import { z } from 'zod'
import { getMontlyInsightsCount } from './insight'
import { authProcedure } from './procedures'
import { getMonthlyTasksCount } from './task'

export const updateUser = authProcedure
	.input(z.object({ name: z.string(), startTime: z.string(), endTime: z.string() }))
	.handler(async ({ ctx, input }) => {
		await db.user.findOneAndUpdate({ _id: ctx.user._id }, input)

		return true
	})

export const getUserSettingsData = authProcedure.handler(async ({ ctx }) => {
	const { subscription } = ctx.user

	const [montlyTasksCount, montlyTasksError] = await getMonthlyTasksCount({ userId: ctx.user._id })
	if (montlyTasksError) throw montlyTasksError

	const [montlyInsightsCount, montlyInsightsError] = await getMontlyInsightsCount({ userId: ctx.user._id })
	if (montlyInsightsError) throw montlyInsightsError

	return {
		user: ctx.user,
		subscriptionUsage: {
			tasks: {
				total: subscription.monlyTasks,
				current: montlyTasksCount,
			},
			insights: {
				total: subscription.montlyInsights,
				current: montlyInsightsCount,
			},
		},
	}
})
