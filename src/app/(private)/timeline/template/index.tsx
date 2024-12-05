'use client'

import { getAuthenticatedUser } from '@/actions/auth'
import { createTask } from '@/actions/task'
import Grid from '@/components/Grid'
import Column from '@/components/Grid/Column'
import { DatePicker } from '@/components/date-picker'
import { useAuth } from '@/hooks/use-auth'
import { combineTags } from '@/utils/tags'
import { useState } from 'react'
import { useServerAction } from 'zsa-react'
import { NoteForm } from '../../../../components/task-form'
import { TaskList } from './task-list'

export type Props = {
	tasks: NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>['0']>['tasks']
}

export function Template({ tasks }: Props) {
	const [currentDate, setCurrentDate] = useState(new Date())
	const { user, refetch } = useAuth()

	const { execute } = useServerAction(createTask, {
		onSuccess: () => refetch(),
	})

	const tagOptions = combineTags(user?.tasks.map((user) => user.tags))

	return (
		<main>
			<Grid>
				<Column size={12} className="flex justify-between gap-2">
					<h1 className="text-5xl font-semibold">Tasks</h1>
					<div>
						<DatePicker
							value={currentDate}
							onChange={(e) => setCurrentDate(e.target.value!)}
							name="date"
							placeholder="Pick a date"
						/>
					</div>
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

				{tasks.length === 0 ? (
					<Column size={12} className="p-8 text-center w-full">
						<span className="text-lg">Start creating your first task</span>
					</Column>
				) : (
					<Column size={12}>
						<TaskList list={tasks} />
					</Column>
				)}
			</Grid>
		</main>
	)
}
