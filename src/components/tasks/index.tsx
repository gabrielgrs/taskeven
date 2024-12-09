'use client'

import { createTask, getTasks } from '@/actions/task'
import { Column, Grid } from '@/components/grid'
import { Tag } from '@/components/tag'
import { useTasks } from '@/hooks/use-tasks'
import { cn } from '@/libs/utils'
import dayjs from 'dayjs'
import { Calendar, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { Calendar as CalendarUI } from './calendar'
import { TaskForm } from './form'
import { TaskList } from './list'

export type Props = {
	tasks: NonNullable<Awaited<ReturnType<typeof getTasks>>['0']>
}

const MotionColumn = motion.create(Column)

export function TasksUI() {
	const [filterTags, setFilterTags] = useState<string[]>([])
	const [currentDate, setCurrentDate] = useState(new Date())
	const [showCalendar, setShowCalendar] = useState(false)
	const { tasks, tags, refetch } = useTasks()

	const createTaskAction = useServerAction(createTask, {
		onSuccess: async () => {
			await refetch()
			toast.success('Task created with success')
		},
	})

	return (
		<main>
			<Grid>
				<Column size={12} className="flex justify-between gap-2 flex-col md:flex-row">
					<h1 className="text-5xl font-semiboldd">Tasks</h1>
					<div className="flex items-center border p-1 rounded-lg gap-2 font-semibold w-max h-12">
						<button className={cn('w-full h-full rounded-sm px-2 relative')} onClick={() => setShowCalendar(false)}>
							{!showCalendar && (
								<motion.div
									layoutId="layour_selector_bg"
									className="absolute rounded-sm bg-primary inset-0 bg- w-full h-full bg-red-499"
								/>
							)}
							<span
								className={cn(
									'duration-1000 relative z-10 flex items-center',
									!showCalendar && 'text-primary-foreground',
								)}
							>
								Tasks ({tasks.filter((x) => !x.date || dayjs(x.date).isSame(currentDate, 'day')).length})
							</span>
						</button>

						<button
							className={cn('w-full h-full rounded-sm px-2 relative flex items-center gap-1')}
							onClick={() => setShowCalendar(true)}
						>
							{showCalendar && (
								<motion.div
									layoutId="layour_selector_bg"
									className="absolute rounded-sm bg-primary inset-0 w-full h-full"
								/>
							)}
							<span
								className={cn(
									'duration-1000 relative z-10 flex items-center gap-2',
									showCalendar && 'text-primary-foreground',
								)}
							>
								{dayjs(currentDate).format('MM/DD/YYYY')}
								<Calendar size={18} />
							</span>
						</button>
					</div>
				</Column>

				{showCalendar && (
					<MotionColumn
						size={12}
						className="overflow-hidden"
						initial={{ opacity: 0, x: -250 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -250 }}
						transition={{ duration: 0.5 }}
					>
						<CalendarUI
							onChangeDate={(date) => {
								setCurrentDate(date)
								setShowCalendar(false)
							}}
							selectedDate={currentDate}
							tasks={tasks}
						/>
					</MotionColumn>
				)}

				{!showCalendar && (
					<>
						<MotionColumn
							size={12}
							initial={{ opacity: 0, x: 250 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 250 }}
							transition={{ duration: 0.5 }}
							className="overflow-hidden"
						>
							<span className="font-semibold">Tags</span>
							<div className="flex items-center gap-2 flex-wrap">
								{tags.length === 0 && <span className="text-muted-foreground">Start creating tags on task</span>}
								{tags.map((tag) => (
									<button
										key={tag}
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
							initial={{ opacity: 0, x: 250 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 250 }}
							transition={{ duration: 0.5 }}
							className="pb-4"
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

						<MotionColumn
							size={12}
							initial={{ opacity: 0, x: 250 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 250 }}
							transition={{ duration: 0.5 }}
						>
							<TaskList
								currentDate={currentDate}
								list={tasks
									.filter((x) => {
										if (filterTags.length === 0) return true
										return x.tags.some((tag) => filterTags.includes(tag))
									})
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
