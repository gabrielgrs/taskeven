'use client'

import { Column, Grid } from '@/components/grid'

import { generateInsight } from '@/actions/insight'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useInsights } from '@/hooks/use-insights'
import { TaskSchema } from '@/libs/mongoose/schemas/task'
import { timeValueToMinutes } from '@/utils/date'
import dayjs from 'dayjs'
import { LucideIcon, Moon, Sparkles, Sun } from 'lucide-react'
import { useServerAction } from 'zsa-react'
import { TaskCard } from '../card'

type Props = {
	list: TaskSchema[]
	currentDate: Date
}

function StartEndCard({ icon: Icon, text, time }: { icon: LucideIcon; text: string; time: string }) {
	return (
		<Column
			size={12}
			className="h-4 w-full flex justify-between gap-4 my-2 items-center px-2 py-4 rounded-md text-muted-foreground"
		>
			<div className="flex items-center gap-2">
				<Icon size={16} />
				<span className="whitespace-nowrap">{text}</span>
			</div>
			<div className="w-full h-[1px] bg-foreground/30"></div>
			{time}
		</Column>
	)
}

export function TaskList({ list, currentDate }: Props) {
	const { user } = useAuth()
	const daysTasks = list.filter((task) => dayjs(task.date).isSame(currentDate, 'day'))
	const dailyCapacityUsage = daysTasks.reduce((acc, curr) => (acc += curr.duration), 0)
	const { insights, refetch: refetchInsights } = useInsights()
	const todayInsight = insights.find((x) => dayjs(x.date).isSame(currentDate, 'day'))

	const generateInsightAction = useServerAction(generateInsight, {
		onSuccess: () => {
			refetchInsights()
		},
	})

	return (
		<Grid>
			{list.length === 0 && (
				<Column size={12}>
					<p className="p-8 text-center text-muted-foreground">No tasks found</p>
				</Column>
			)}

			{daysTasks.length > 0 && (
				<>
					{user?.startTime && (
						<Column size={12}>
							<StartEndCard icon={Sun} text="Start time" time={user.startTime} />
						</Column>
					)}

					{daysTasks.map((task) => {
						return (
							<Column size={12} key={task._id}>
								<TaskCard task={task} />
							</Column>
						)
					})}

					{user?.endTime && (
						<Column size={12}>
							<StartEndCard icon={Moon} text="End time" time={user.endTime} />
						</Column>
					)}

					{user && (
						<>
							<Column size={12} className="">
								<span>Daily capacity</span>
								<p className="text-muted-foreground">
									{dailyCapacityUsage}h / {Number(user.capacity / 60).toFixed(2)}h
								</p>
							</Column>
						</>
					)}

					{daysTasks.length > 0 && (
						<Column size={12} className="flex justify-end">
							<Button
								loading={generateInsightAction.isPending}
								type="button"
								variant="secondary"
								onClick={() => {
									const minutes = timeValueToMinutes(dayjs(new Date()).format('HH:mm'))

									generateInsightAction.execute({
										date: dayjs(currentDate).add(minutes, 'minute').toDate(),
										tasks: daysTasks.map((task) => ({
											date: task.date ? new Date(task.date) : undefined,
											title: task.title,
											duration: task.duration,
										})),
									})
								}}
							>
								Generate insights <Sparkles />
							</Button>
						</Column>
					)}
					{todayInsight && (
						<Column size={12}>
							<div className="bg-secondary/50 p-2 rounded-lg">
								<span className="font-semibold">Insight:</span>
								<p className="text-muted-foreground">{todayInsight.content}</p>
							</div>
						</Column>
					)}
				</>
			)}
		</Grid>
	)
}
