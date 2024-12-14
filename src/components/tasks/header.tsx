'use client'

import { cn } from '@/libs/utils'
import dayjs from 'dayjs'
import { Calendar } from 'lucide-react'
import { motion } from 'motion/react'
import { Dispatch } from 'react'
import { Button } from '../ui/button'
import { ScreenState } from './types'

type Props = {
	screenState: ScreenState
	setScreenState: Dispatch<ScreenState>
	currentDate: Date
}
export function Header({ screenState, setScreenState, currentDate }: Props) {
	return (
		<div className="flex justify-between w-full">
			<div className="flex items-center border p-1 rounded-lg gap-2 font-semibold w-max h-12">
				<button className={cn('w-full h-full rounded-sm px-2 relative')} onClick={() => setScreenState('list')}>
					{screenState === 'list' && (
						<motion.div
							layoutId="layour_selector_bg"
							className="absolute rounded-sm bg-secondary inset-0 bg- w-full h-full bg-red-499"
						/>
					)}
					<p
						className={cn('duration-1000 relative z-10 flex items-center', screenState === 'list' && 'text-foreground')}
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
				<Button type="button" onClick={() => setScreenState('form')}>
					Create task
				</Button>
			</div>
		</div>
	)
}
