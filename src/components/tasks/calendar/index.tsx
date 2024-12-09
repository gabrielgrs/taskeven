'use client'

import { TaskSchema } from '@/libs/mongoose/schemas/task'
import { cn } from '@/libs/utils'
import dayjs from 'dayjs'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Column, Grid } from '../../grid'
import { Button } from '../../ui/button'

type Props = {
	selectedDate: Date
	tasks: TaskSchema[]
	onChangeDate: (date: Date, keepCalendarVisible: boolean) => void
}

function getDaysOfMonth(selectedDate: Date, tasks: TaskSchema[]) {
	const firstDayOfMonth = dayjs(selectedDate).startOf('month').toDate()
	const daysInMonth = dayjs(firstDayOfMonth).daysInMonth()

	return Array(daysInMonth)
		.fill(null)
		.map((_, index) => {
			const date = dayjs(firstDayOfMonth).add(index + 1, 'day')
			return {
				date,
				tasksQuantity: tasks.filter((item) => item.date).filter((item) => dayjs(item.date).isSame(date, 'day')).length,
			}
		})
}

export function Calendar({ selectedDate, tasks, onChangeDate }: Props) {
	const [month, _, year] = dayjs(selectedDate).format('MMMM/DD/YYYY').split('/')

	const calendar = getDaysOfMonth(
		selectedDate,
		tasks.filter((x) => x.date),
	)

	return (
		<Grid>
			<Column size={12}>
				<div className="text-center flex justify-between items-center gap-2 h-12">
					<div className="flex items-center gap-2">
						<button
							onClick={() => onChangeDate(dayjs(selectedDate).subtract(1, 'month').toDate(), true)}
							className="duration-500 hover:scale-110 opacity-50 hover:opacity-70"
						>
							<ChevronsLeft />
						</button>
						{month} / {year}
						<button
							onClick={() => onChangeDate(dayjs(selectedDate).add(1, 'month').toDate(), true)}
							className="duration-500 hover:scale-110 opacity-50 hover:opacity-70"
						>
							<ChevronsRight />
						</button>
					</div>
					{!dayjs(selectedDate).isSame(new Date(), 'month') && (
						<Button size="sm" variant="outline" onClick={() => onChangeDate(new Date(), true)}>
							Back to today
						</Button>
					)}
				</div>
			</Column>
			<Column size={12} className="grid grid-cols-7 gap-4">
				{calendar.map((item) => {
					return (
						<button
							key={`day_${item.date.toISOString()}`}
							className={cn(
								'duration-500 hover:opacity-90 hover:translate-x-0.5 hover:-translate-y-0.5 w-8 h-8 md:w-12 md:h-12 flex text-foreground/70 items-center justify-center rounded bg-foreground/10 border border-bg-foreground/20',
								dayjs(new Date()).isSame(item.date, 'day') && 'font-bold',
								item.tasksQuantity === 1 && 'border-b-2 border-b-green-500',
								item.tasksQuantity === 2 && 'border-b-2 border-b-yellow-500',
								item.tasksQuantity >= 3 && 'border-b-2 border-b-red-500',
							)}
							onClick={() => {
								onChangeDate(item.date.toDate(), false)
							}}
						>
							{item.date.format('D')}
						</button>
					)
				})}
			</Column>
		</Grid>
	)
}
