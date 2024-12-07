'use client'

import { TaskSchema } from '@/libs/mongoose/schemas/user'
import { cn } from '@/libs/utils'
import { getMonthsOfYear } from '@/utils/date/months'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { Column, Grid } from '../grid'

const MotionColumn = motion.create(Column)

type Props = {
	selectedDate: Date
	tasks: TaskSchema[]
	onChangeDate: (date: Date) => void
}

export function Calendar({ selectedDate, tasks, onChangeDate }: Props) {
	const firstDayOfYear = dayjs(selectedDate).startOf('year').toDate()
	const currentYear = dayjs(selectedDate).year()

	return (
		<MotionColumn
			size={12}
			className="overflow-hidden"
			initial={{ opacity: 0, x: -250 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -250 }}
			transition={{ duration: 0.5 }}
		>
			<div className="text-center text-2xl">{currentYear}</div>
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
													onChangeDate(day.toDate())
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
	)
}
