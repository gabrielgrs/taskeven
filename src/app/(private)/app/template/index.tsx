'use client'

import { getAuthenticatedUser } from '@/actions/auth'
import { createTask } from '@/actions/task'
import { Column, Grid } from '@/components/grid'
import { Tag } from '@/components/tag'
import { TaskForm } from '@/components/tasks/form'
import { TaskList } from '@/components/tasks/list'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/libs/utils'
import { getMonthsOfYear } from '@/utils/date/months'
import dayjs from 'dayjs'
import { Calendar, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useServerAction } from 'zsa-react'

export type Props = {
	tasks: NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>['0']>['tasks']
}

const MotionColumn = motion.create(Column)

export function Template() {
	const [filterTags, setFilterTags] = useState<string[]>([])
	const [currentDate, setCurrentDate] = useState(new Date())
	const firstDayOfYear = dayjs(currentDate).startOf('year').toDate()
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
					<MotionColumn
						size={12}
						className="overflow-hidden"
						initial={{ opacity: 0, x: -250 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -250 }}
						transition={{ duration: 0.5 }}
					>
						<div className="text-center text-2xl">{dayjs(currentDate).year()}</div>
						<Grid>
							{getMonthsOfYear().map((month, index) => {
								const firstDayOfMonth = dayjs(firstDayOfYear).add(index, 'month')
								const daysInMonth = dayjs(firstDayOfMonth).daysInMonth()

								return (
									<Column size={6} key={month}>
										<span>{month}</span>
										<div className="grid grid-cols-7 gap-2">
											{Array(daysInMonth)
												.fill(null)
												.map((_, index) => {
													const day = dayjs(firstDayOfMonth).add(index, 'day')
													const tasksQuantity = tasks
														.filter((item) => item.date)
														.filter((item) => dayjs(item.date).isSame(day, 'day')).length

													return (
														<button
															key={`day_${index}`}
															className={cn(
																'duration-500 hover:opacity-90 hover:translate-x-0.5 hover:-translate-y-0.5 w-8 h-8 flex text-sm text-foreground/70 items-center justify-center rounded bg-foreground/10 border border-bg-foreground/20',
																dayjs(new Date()).isSame(day, 'day') && 'font-bold',
																tasksQuantity === 1 && 'border-b-2 border-b-green-500',
																tasksQuantity === 2 && 'border-b-2 border-b-yellow-500',
																tasksQuantity >= 3 && 'border-b-2 border-b-red-500',
															)}
															onClick={() => {
																setCurrentDate(day.toDate())
																setShowCalendar(false)
															}}
														>
															{day.format('D')}
														</button>
													)
												})}
										</div>
									</Column>
								)
							})}
						</Grid>
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
