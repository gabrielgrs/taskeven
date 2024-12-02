'use client'

import { createNote } from '@/actions/note'
import Grid from '@/components/Grid'
import Column from '@/components/Grid/Column'
import { useTags } from '@/hooks/use-tags'
import { cn } from '@/lib/utils'
import { Note } from '@/types'
import { getMonthsOfYear } from '@/utils/date/months'
import { sortNotes } from '@/utils/sort'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useServerAction } from 'zsa-react'
import { NoteForm } from '../../../../components/note-form'
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
	const { setQueryData } = useQueryClient()

	const { tags } = useTags()
	const { execute } = useServerAction(createNote, {
		onSuccess: ({ data }) => {
			setQueryData(['notes'], (previous: Note[] = []) => {
				return sortNotes([...previous, data.note])
			})
		},
	})

	return (
		<main>
			<FormProvider {...form}>
				<Grid>
					<Column size={12}>
						<h1 className="text-5xl font-semibold">Tasks</h1>
					</Column>

					<Column size={12}>
						<Tags />
					</Column>
					<Column size={12}>
						<NoteForm
							onSubmit={(note) =>
								execute({
									title: note.title!,
									tags: note.tags ?? [],
									content: note.content,
									date: note.date,
								})
							}
							tagOptions={tags}
						/>
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
						<Notes />
					</Column>
				</Grid>
			</FormProvider>
		</main>
	)
}
