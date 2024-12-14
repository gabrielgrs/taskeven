'use client'

import { Column, Grid } from '@/components/grid'

import { useAuth } from '@/hooks/use-auth'
import { TaskSchema } from '@/libs/mongoose/schemas/task'
import dayjs from 'dayjs'
import { LucideIcon, Moon, Sun } from 'lucide-react'
import { TaskCard } from '../card'

type Props = {
	list: TaskSchema[]
	currentDate: Date
}

function StartEndCard({ icon: Icon, text, time }: { icon: LucideIcon; text: string; time: string }) {
	return (
		<Column size={12} className="h-4 w-full flex justify-between gap-4 my-2 items-center px-2 py-4 rounded-md">
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

	const tasksWithoutDate = list.filter((task) => !task.date)
	const daysTasks = list.filter((task) => task.date && dayjs(task.date).isSame(currentDate, 'day'))

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
				</>
			)}

			{tasksWithoutDate.length > 0 &&
				tasksWithoutDate.map((task) => {
					return (
						<Column size={12} key={task._id}>
							<TaskCard task={task} />
						</Column>
					)
				})}
		</Grid>
	)
}
