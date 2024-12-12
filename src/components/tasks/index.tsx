'use client'

import { createTask, getTasks } from '@/actions/task'
import { Column, Grid } from '@/components/grid'
import { Tag } from '@/components/tag'
import { useAuth } from '@/hooks/use-auth'
import { useTasks } from '@/hooks/use-tasks'
import { cn } from '@/libs/utils'
import dayjs from 'dayjs'
import { Calendar, Settings, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Calendar as CalendarUI } from './calendar'
import { TaskForm } from './form'
import { TaskList } from './list'
import { SettingsUI } from './settings'

export type Props = {
	tasks: NonNullable<Awaited<ReturnType<typeof getTasks>>['0']>
}

const MotionColumn = motion.create(Column)

type ScreenState = 'list' | 'form' | 'settings' | 'calendar'
export function TasksUI() {
	const [screenState, setScreenState] = useState<ScreenState>('list')
	const [filterTags, setFilterTags] = useState<string[]>([])
	const [currentDate, setCurrentDate] = useState(new Date())
	const [hideUndated, setHideUndated] = useState(false)
	const [hideCompleted, setHideCompleted] = useState(false)
	const { tasks, tags, refetch } = useTasks()
	const { onUpdateUser, isUpdating, user } = useAuth()

	const createTaskAction = useServerAction(createTask, {
		onSuccess: async () => {
			await refetch()
			toast.success('Task created with success')
			setScreenState('list')
		},
	})

	return (
		<main className="relative">
			<Grid className="relative">
				<Column
					size={12}
					className="flex flex-col-reverse md:flex-row justify-between gap-2 items-start md:items-center"
				>
					<div className="flex items-center border p-1 rounded-lg gap-2 font-semibold w-max h-12">
						<button className={cn('w-full h-full rounded-sm px-2 relative')} onClick={() => setScreenState('list')}>
							{screenState === 'list' && (
								<motion.div
									layoutId="layour_selector_bg"
									className="absolute rounded-sm bg-secondary inset-0 bg- w-full h-full bg-red-499"
								/>
							)}
							<span
								className={cn(
									'duration-1000 relative z-10 flex items-center',
									screenState === 'list' && 'text-foreground',
								)}
							>
								Tasks ({tasks.filter((x) => !x.date || dayjs(x.date).isSame(currentDate, 'day')).length})
							</span>
						</button>

						<button
							className={cn('w-full h-full rounded-sm px-2 relative flex items-center gap-1')}
							onClick={() => setScreenState('calendar')}
						>
							{screenState === 'calendar' && (
								<motion.div
									layoutId="layour_selector_bg"
									className="absolute rounded-sm bg-secondary inset-0 bg- w-full h-full bg-red-499"
								/>
							)}
							<span
								className={cn(
									'duration-1000 relative z-10 flex items-center gap-2',
									screenState === 'calendar' && 'text-foreground',
								)}
							>
								{dayjs(currentDate).format('MM/DD/YYYY')}
								<Calendar size={18} />
							</span>
						</button>
					</div>

					<div className="flex items-center gap-1">
						<Button type="button" size="sm" variant="outline" onClick={() => setScreenState('settings')}>
							<Settings />
						</Button>
						<Button type="button" onClick={() => setScreenState('form')}>
							Create task
						</Button>
					</div>
				</Column>

				{screenState === 'settings' && (
					<MotionColumn
						size={12}
						className="overflow-hidden bg-primary/5 rounded-md p-4"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
					>
						<SettingsUI
							initialValues={
								user
									? {
											startTime: user.startTime,
											endTime: user.endTime,
											hideUndated,
											hideCompleted,
										}
									: undefined
							}
							isSubmitting={isUpdating}
							onSubmit={async (values) => {
								await onUpdateUser({
									startTime: values.startTime,
									endTime: values.endTime,
								})
								setHideUndated(values.hideUndated)
								setHideCompleted(values.hideCompleted)
							}}
						/>
					</MotionColumn>
				)}

				{screenState === 'form' && (
					<MotionColumn
						size={12}
						className="overflow-hidden bg-primary/5 rounded-md"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
					>
						<TaskForm
							isSubmitting={createTaskAction.isPending}
							onSubmit={(note) => {
								createTaskAction.execute({
									title: note.title!,
									tags: note.tags,
									date: note.date,
								})
							}}
							suggestions={tags}
						/>
					</MotionColumn>
				)}

				{screenState === 'calendar' && (
					<MotionColumn
						size={12}
						className="overflow-hidden"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						transition={{ duration: 0.5 }}
					>
						<CalendarUI
							onChangeDate={(date, keepCalendar) => {
								setCurrentDate(date)
								setScreenState(keepCalendar ? 'calendar' : 'list')
							}}
							selectedDate={currentDate}
							tasks={tasks}
						/>
					</MotionColumn>
				)}

				{screenState === 'list' && (
					<>
						<MotionColumn
							size={12}
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 50 }}
							transition={{ duration: 0.5 }}
						>
							<Label>Tags</Label>
							<div className="flex gap-2 flex-wrap text-center">
								{tags.map((tag) => (
									<button
										key={tag}
										type="button"
										onClick={() => {
											setFilterTags((p) => (p.includes(tag) ? p.filter((x) => x !== tag) : [...p, tag]))
										}}
										className="cursor-pointer"
									>
										<Tag
											className={cn(
												'flex items-center gap-1',
												filterTags.includes(tag) ? 'bg-primary text-primary-foreground' : 'opacity-90',
											)}
										>
											{tag}
											{filterTags.includes(tag) && (
												<motion.span
													initial={{ opacity: 0, scale: 0 }}
													animate={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
												>
													<X size={12} />
												</motion.span>
											)}
										</Tag>
									</button>
								))}
							</div>
						</MotionColumn>

						<MotionColumn
							size={12}
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 50 }}
							transition={{ duration: 0.5 }}
						>
							<TaskList
								currentDate={currentDate}
								list={tasks
									.filter((x) => {
										if (filterTags.length === 0) return true
										return x.tags.some((tag) => filterTags.includes(tag))
									})
									.filter((x) => (hideCompleted ? !x.completed : true))
									.filter((x) => (hideUndated ? x.date : true))
									.filter((x) => {
										if (!x.date) return true

										return dayjs(x.date).isSame(currentDate, 'day')
									})}
							/>
						</MotionColumn>
					</>
				)}
			</Grid>
		</main>
	)
}
