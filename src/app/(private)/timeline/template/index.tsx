'use client'

import { getAuthenticatedUser } from '@/actions/auth'
import { createTask } from '@/actions/task'
import Grid from '@/components/Grid'
import Column from '@/components/Grid/Column'
import { useAuth } from '@/hooks/use-tasks'
import { TaskSchema } from '@/libs/mongoose/schemas/user'
import { cn } from '@/libs/utils'
import { getMonthsOfYear } from '@/utils/date/months'
import { sortTasks } from '@/utils/sort'
import { combineTags } from '@/utils/tags'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useServerAction } from 'zsa-react'
import { NoteForm } from '../../../../components/task-form'
import { Tasks } from './tasks'

const DAYS_TO_SHOW = 7

export type Props = {
	tasks: NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>['0']>['tasks']
}

export function Template({ tasks }: Props) {
	const [currentDate, setCurrentDate] = useState(new Date())
	const { setQueryData } = useQueryClient()
	const { user } = useAuth()

	const { execute } = useServerAction(createTask, {
		onSuccess: ({ data }) => {
			setQueryData(['notes'], (previous: TaskSchema[] = []) => {
				return sortTasks([...previous, data])
			})
		},
	})

	const tagOptions = combineTags(user?.tasks.map((user) => user.tags))

	return (
		<main>
			<Grid>
				<Column size={12}>
					<h1 className="text-5xl font-semibold">Tasks</h1>
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
						tagOptions={tagOptions}
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
					<Tasks list={tasks} />
				</Column>
			</Grid>
		</main>
	)
}
