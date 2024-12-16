'use client'

import { useAuth } from '@/hooks/use-auth'
import { TaskSchema } from '@/libs/mongoose/schemas/task'
import { cn } from '@/libs/utils'
import { calculatePercentage } from '@/utils/number'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Column, Grid } from '../../grid'
import { Button } from '../../ui/button'

dayjs.extend(localeData)

type Props = {
	selectedDate: Date
	tasks: TaskSchema[]
	onChangeDate: (date: Date, keepCalendarVisible: boolean) => void
}

function getDaysOfMonth(selectedDate: Date, tasks: TaskSchema[]) {
	const firstDayOfMonth = dayjs(selectedDate).startOf('month').toDate()
	const weekDay = dayjs(firstDayOfMonth).day()
	const daysInMonth = dayjs(firstDayOfMonth).daysInMonth()
	const firstDate = dayjs(firstDayOfMonth).subtract(weekDay, 'day').subtract(1, 'day')

	return Array(daysInMonth + weekDay)
		.fill(null)
		.map((_, index) => {
			const date = dayjs(firstDate).add(index + 1, 'day')
			const dailyTasks = tasks.filter((item) => dayjs(item.date).isSame(date, 'day'))

			return {
				date,
				isAnotherMonth: index < weekDay,
				dailyActivityInMinutes: dailyTasks.reduce((acc: number, curr) => (acc += curr.duration), 0) * 60,
				tasksQuantity: dailyTasks.length,
			}
		})
}

export function Calendar({ selectedDate, tasks, onChangeDate }: Props) {
	const [month, _, year] = dayjs(selectedDate).format('MMMM/DD/YYYY').split('/')
	const { user } = useAuth()

	const capacity = user?.capacity ?? 0

	const calendar = getDaysOfMonth(selectedDate, tasks)

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
				{dayjs.weekdays(true).map((day) => (
					<div key={day} className="text-sm text-muted-foreground text-center truncate">
						{day}
					</div>
				))}

				{calendar.map((item) => {
					const dailyCapacityPercentage = calculatePercentage(item.dailyActivityInMinutes, capacity)

					if (item.isAnotherMonth) {
						return <div key={`day_${item.date.toISOString()}`} />
					}

					return (
						<div key={`day_${item.date.toISOString()}`} className="flex flex-col gap-1 items-center justify-center">
							<button
								className={cn(
									'duration-500 hover:opacity-90 hover:translate-x-0.5 hover:-translate-y-0.5 w-8 h-8 md:w-12 md:h-12 flex text-foreground/70 items-center justify-center rounded bg-foreground/5 border border-bg-foreground/20',
									dayjs(new Date()).isSame(item.date, 'day') && 'font-bold',
									dailyCapacityPercentage >= 30 && 'border-b-2 border-b-green-500',
									dailyCapacityPercentage >= 60 && 'border-b-2 border-b-yellow-500',
									dailyCapacityPercentage >= 90 && 'border-b-2 border-b-red-500',
									dailyCapacityPercentage === 0 && 'border-b-2 border-b-primary/10 bg-foreground/10',
								)}
								onClick={() => {
									onChangeDate(item.date.toDate(), false)
								}}
							>
								{item.date.format('D')}
							</button>
							<div className="flex items-center gap-1">
								{Array(item.tasksQuantity)
									.fill(null)
									.map((_, index) => {
										return <div className="w-2 h-2 rounded-full bg-foreground/30" key={`item_mark_${index}`} />
									})}
							</div>
						</div>
					)
				})}
			</Column>
		</Grid>
	)
}
