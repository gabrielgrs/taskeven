'use client'

import { Column, Grid } from '@/components/grid'

import { useAuth } from '@/hooks/use-auth'
import { TaskSchema } from '@/libs/mongoose/schemas/task'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { LucideIcon, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TaskCard } from '../card'
import { ScreenStatus } from './types'

dayjs.extend(duration)
dayjs.extend(relativeTime)

type Props = {
	list: TaskSchema[]
	currentDate: Date
}

function WakeUpAndSleepCard({ icon: Icon, text, time = -1 }: { icon: LucideIcon; text: string; time?: number }) {
	if (!time || time < 0) return null

	return (
		<Column
			size={12}
			className="h-4 w-full flex justify-between my-2 items-center bg-foreground/5 px-2 py-4 rounded-md"
		>
			<div className="flex items-center gap-2">
				<Icon size={16} />
				{text}
			</div>
			{dayjs(new Date()).startOf('day').add(time, 'minutes').format('HH:mm')}
		</Column>
	)
}

export function TaskList({ list, currentDate }: Props) {
	const [expandedNoteId, setExpandedNoteId] = useState('')
	const [screenStatus, setScreenStatus] = useState<ScreenStatus | null>(null)
	const { user } = useAuth()

	useEffect(() => {
		const keyDownListener = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setExpandedNoteId('')
				setScreenStatus(null)
			}
		}
		window.addEventListener('keydown', keyDownListener)

		return () => {
			window.removeEventListener('keydown', keyDownListener)
		}
	}, [])

	const daysFromToday = dayjs(currentDate).diff(dayjs(), 'days')
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
					<Column size={12}>
						<span className="text-lg font-semibold">
							{daysFromToday === 0 ? 'Today' : dayjs.duration(daysFromToday, 'days').humanize(true)} tasks
						</span>
					</Column>

					<WakeUpAndSleepCard icon={Sun} text="Wake up time" time={user?.wakeUpTime} />

					{daysTasks.map((task) => {
						return (
							<Column size={12} key={task._id}>
								<TaskCard
									screenStatus={screenStatus}
									task={task}
									setScreenStatus={setScreenStatus}
									isExpanded={expandedNoteId === task._id}
									onCancel={() => {
										setScreenStatus(null)
									}}
									onExpand={() => {
										setExpandedNoteId((p) => (p === task._id ? '' : task._id))
									}}
								/>
							</Column>
						)
					})}

					<WakeUpAndSleepCard icon={Moon} text="Sleep time" time={user?.sleepTime} />
				</>
			)}

			{tasksWithoutDate.length > 0 && (
				<>
					<Column size={12}>
						<hr />
					</Column>

					{tasksWithoutDate.map((task) => {
						return (
							<Column size={12} key={task._id}>
								<TaskCard
									task={task}
									setScreenStatus={setScreenStatus}
									screenStatus={screenStatus}
									isExpanded={expandedNoteId === task._id}
									onCancel={() => {
										setScreenStatus(null)
									}}
									onExpand={() => {
										setExpandedNoteId((p) => (p === task._id ? '' : task._id))
									}}
								/>
							</Column>
						)
					})}
				</>
			)}
		</Grid>
	)
}
