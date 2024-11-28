'use client'
import Grid from '@/components/Grid'
import Column from '@/components/Grid/Column'
import { useTags } from '@/hooks/use-tags'
import { cn } from '@/lib/utils'
import { getMonthsOfYear } from '@/utils/date/months'
import dayjs from 'dayjs'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { NoteForm } from './note-form'
import { Notes } from './notes'
import { Tags } from './tags'
import type { DefaultValues } from './types'

const defaultValues: DefaultValues = {
	tags: [],
}

const DAYS_TO_SHOW = 7

export function Template() {
	const form = useForm({ defaultValues })
	const [currentDate, setCurrentDate] = useState(new Date())
	const [notesView, setNotesView] = useState<'grid' | 'timeline'>('grid')
	const { tags } = useTags()

	return (
		<main>
			<FormProvider {...form}>
				<Grid>
					<Column size={12}>
						<h1 className="text-5xl font-semibold">Tasks</h1>
					</Column>
					<Column size={12} className="flex items-center gap-8">
						<button
							type="button"
							className={cn('text-4xl font-semibold opacity-50 duration-500', notesView === 'grid' && 'opacity-100')}
							onClick={() => setNotesView('grid')}
						>
							Grid
						</button>

						<button
							type="button"
							className={cn(
								'text-4xl font-semibold opacity-50 duration-500',
								notesView === 'timeline' && 'opacity-100',
							)}
							onClick={() => setNotesView('timeline')}
						>
							Timeline
						</button>
					</Column>
					<Column size={12}>
						<Tags />
					</Column>
					<Column size={12}>
						<NoteForm onSubmit={() => {}} tagOptions={tags} />
					</Column>
					<Column size={12} className="flex items-center justify-center gap-4">
						{getMonthsOfYear().map((month, index) => {
							const monthIndex = dayjs(currentDate).month()
							return (
								<button
									key={month}
									type="button"
									className={cn('duration-500 hover:scale-125 hover:px-2', monthIndex === index ? 'font-semibold' : '')}
								>
									{month.slice(0, 3)}
								</button>
							)
						})}
					</Column>
					<Column size={12} className="flex items-center justify-center gap-4">
						{Array(DAYS_TO_SHOW)
							.fill(null)
							.map((_, index) => {
								const day = dayjs(currentDate).add(index - Math.floor(DAYS_TO_SHOW / 2), 'day')
								const isToday = dayjs(day).isSame(new Date(), 'day')
								return (
									<button
										key={day.toISOString()}
										onClick={() => setCurrentDate(day.toDate())}
										type="button"
										className={cn(isToday ? 'font-semibold' : '')}
									>
										<div
											className={cn(
												'bg-foreground/10 h-8 w-8 flex items-center justify-center rounded-full duration-500 hover:scale-125 hover:px-2',
												isToday ? 'bg-foreground text-background' : '',
											)}
										>
											{dayjs(day).format('DD')}
										</div>
										<span>{dayjs(day).format('ddd')}</span>
									</button>
								)
							})}
					</Column>
					<Column size={12}>
						<Notes notesView={notesView} />
					</Column>
				</Grid>
			</FormProvider>
		</main>
	)
}
