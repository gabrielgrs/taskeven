'use client'

import { Column, Grid } from '@/components/grid'

import { TaskSchema } from '@/libs/mongoose/schemas/task'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState } from 'react'
import { TaskCard } from '../card'
import { ScreenStatus } from './types'

dayjs.extend(duration)
dayjs.extend(relativeTime)

type Props = {
	list: TaskSchema[]
	currentDate: Date
}

export function TaskList({ list, currentDate }: Props) {
	const [expandedNoteId, setExpandedNoteId] = useState('')
	const [screenStatus, setScreenStatus] = useState<ScreenStatus | null>(null)

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

					{daysTasks.map((task) => {
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
