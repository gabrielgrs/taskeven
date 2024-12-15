'use client'

import { createTask, getTasks } from '@/actions/task'
import { Column, Grid } from '@/components/grid'
import { Tag } from '@/components/tag'
import { useTasks } from '@/hooks/use-tasks'
import { cn } from '@/libs/utils'
import { ServerActionResponse } from '@/utils/action'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { Calendar as CalendarUI } from './calendar'
import { TaskForm } from './form'
import { Header } from './header'
import { TaskList } from './list'
import { ScreenState } from './types'

export type Props = {
	tasks: ServerActionResponse<typeof getTasks>
}

const MotionColumn = motion.create(Column)

export function TasksUI() {
	const [screenState, setScreenState] = useState<ScreenState>('list')
	const [filterTag, setFilterTag] = useState<'All' | string>('All')
	const [currentDate, setCurrentDate] = useState(new Date())
	const { tasks, tags, refetch } = useTasks()

	const createTaskAction = useServerAction(createTask, {
		onSuccess: async () => {
			await refetch()
			toast.success('Task created with success')
			setScreenState('list')
		},
	})

	return (
		<div className="relative flex flex-col gap-4">
			<Grid className="relative">
				<Column size={12}>
					<Header screenState={screenState} setScreenState={setScreenState} currentDate={currentDate} />
				</Column>

				<MotionColumn
					key={screenState}
					size={12}
					className="overflow-hidden relative"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 50 }}
				>
					{screenState === 'form' && (
						<TaskForm
							isSubmitting={createTaskAction.isPending}
							onSubmit={(task) => {
								return createTaskAction.execute({
									title: task.title!,
									tag: task.tag,
									date: task.date,
									duration: task.duration,
								})
							}}
							suggestions={tags}
						/>
					)}

					{screenState === 'calendar' && (
						<CalendarUI
							onChangeDate={(date, keepCalendar) => {
								setCurrentDate(date)
								setScreenState(keepCalendar ? 'calendar' : 'list')
							}}
							selectedDate={currentDate}
							tasks={tasks}
						/>
					)}

					{screenState === 'list' && (
						<>
							<Column size={12} className="flex gap-2 flex-wrap text-center p-2">
								{['All', ...tags].map((tag) => (
									<button key={tag} type="button" onClick={() => setFilterTag(tag)} className="cursor-pointer">
										<Tag
											className={cn(
												'flex items-center gap-1',
												filterTag.includes(tag) ? 'bg-primary text-primary-foreground' : 'opacity-90',
											)}
										>
											{tag}
										</Tag>
									</button>
								))}
							</Column>

							<TaskList
								currentDate={currentDate}
								list={tasks
									.filter((item) => {
										if (filterTag === 'All') return true
										return item.tag === filterTag
									})
									.filter((x) => {
										if (!x.date) return true
										return dayjs(x.date).isSame(currentDate, 'day')
									})}
							/>
						</>
					)}
				</MotionColumn>
			</Grid>
		</div>
	)
}
