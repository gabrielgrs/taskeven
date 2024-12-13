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

function StartEndCard({ icon: Icon, text, time }: { icon: LucideIcon; text: string; time: string }) {
	return (
		<Column
			size={12}
			className="h-4 w-full flex justify-between my-2 items-center bg-foreground/5 px-2 py-4 rounded-md"
		>
			<div className="flex items-center gap-2">
				<Icon size={16} />
				{text}
			</div>
			{time}
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
		</Grid>
	)
}
