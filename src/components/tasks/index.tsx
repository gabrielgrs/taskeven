'use client'

import { getAuthenticatedUser } from '@/actions/auth'
import { createTask } from '@/actions/task'
import { Column, Grid } from '@/components/grid'
import { Tag } from '@/components/tag'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/libs/utils'
import dayjs from 'dayjs'
import { Calendar, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useServerAction } from 'zsa-react'
import { Calendar as CalendarUI } from './calendar'
import { TaskForm } from './form'
import { TaskList } from './list'

export type Props = {
	tasks: NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>['0']>['tasks']
}

const MotionColumn = motion.create(Column)

export function TasksUI() {
	const [filterTags, setFilterTags] = useState<string[]>([])
	const [currentDate, setCurrentDate] = useState(new Date())
	const [showCalendar, setShowCalendar] = useState(false)
	const { tasks, tags, refetch } = useAuth()

	const { execute } = useServerAction(createTask, {
		onSuccess: () => refetch(),
	})

	return (
		<main>
			<Grid>
				<Column size={12} className="flex justify-between gap-2">
					<h1 className="text-5xl font-semiboldd">Tasks</h1>
					<div className="flex items-center border p-1 rounded-lg gap-2 font-semibold">
						<button className={cn('w-full h-full rounded-sm px-2 relative')} onClick={() => setShowCalendar(false)}>
							{!showCalendar && (
								<motion.div
									layoutId="layour_selector_bg"
									className="absolute rounded-sm bg-primary inset-0 bg- w-full h-full bg-red-499"
								/>
							)}
							<span className={cn('duration-1000 relative z-10', !showCalendar && 'text-primary-foreground')}>
								Timeline
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
					<CalendarUI
						onChangeDate={(date) => {
							setCurrentDate(date)
							setShowCalendar(false)
						}}
						selectedDate={currentDate}
						tasks={tasks}
					/>
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
						>
							<TaskForm
								onSubmit={(note) => {
									execute({
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
