'use client'

import { generateInsight } from '@/actions/insight'
import { useInsights } from '@/hooks/use-insights'
import { TaskSchema } from '@/libs/mongoose/schemas/task'
import { cn } from '@/libs/utils'
import { timeValueToMinutes } from '@/utils/date'
import dayjs from 'dayjs'
import { Calendar, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { Dispatch } from 'react'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { Button } from '../ui/button'
import { ScreenState } from './types'

type Props = {
	screenState: ScreenState
	setScreenState: Dispatch<ScreenState>
	currentDate: Date
	currentDayTasks: TaskSchema[]
}
export function Header({ screenState, setScreenState, currentDate, currentDayTasks }: Props) {
	const { refetch: refetchInsights } = useInsights()

	const generateInsightAction = useServerAction(generateInsight, {
		onError: (error) => toast.error(error.err.message || 'Failed to generate insight'),
		onSuccess: () => {
			refetchInsights()
		},
	})

	return (
		<div className="flex justify-between w-full">
			<div className="flex items-center border p-1 rounded-lg gap-2 font-semibold w-max h-12 text-sm md:text-base">
				<button className={cn('w-full h-full rounded-sm px-2 relative')} onClick={() => setScreenState('list')}>
					{screenState === 'list' && (
						<motion.div
							layoutId="layour_selector_bg"
							className="absolute rounded-sm bg-secondary inset-0 bg- w-full h-full bg-red-499"
						/>
					)}
					<p
						className={cn(
							'duration-1000 relative z-10 flex items-center ',
							screenState === 'list' && 'text-foreground',
						)}
					>
						Tasks
					</p>
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
						<Calendar size={18} className="hidden md:block" />
					</span>
				</button>
			</div>

			<div className="flex items-center gap-1">
				{currentDayTasks.length > 0 && (
					<Button
						loading={generateInsightAction.isPending}
						type="button"
						variant="outline"
						onClick={() => {
							const minutes = timeValueToMinutes(dayjs(new Date()).format('HH:mm'))

							generateInsightAction.execute({
								date: dayjs(currentDate).add(minutes, 'minute').toDate(),
								tasks: currentDayTasks.map((task) => ({
									date: task.date ? new Date(task.date) : undefined,
									title: task.title,
									duration: task.duration,
								})),
							})
						}}
					>
						<span className="hidden md:block">Insight</span> <Sparkles className="block md:hidden" />
					</Button>
				)}
				<Button type="button" onClick={() => setScreenState('form')}>
					Create task
				</Button>
			</div>
		</div>
	)
}
