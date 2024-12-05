'use client'

import { getAuthenticatedUser } from '@/actions/auth'
import { createTask } from '@/actions/task'
import Grid from '@/components/Grid'
import Column from '@/components/Grid/Column'
import { DatePicker } from '@/components/date-picker'
import { Tag } from '@/components/tag'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/libs/utils'
import { X } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useServerAction } from 'zsa-react'
import { TaskForm } from '../../../../components/task-form'
import { TaskList } from './task-list'

export type Props = {
	tasks: NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>['0']>['tasks']
}

export function Template({ tasks: initialTasks }: Props) {
	const [filterTags, setFilterTags] = useState<string[]>([])
	const [currentDate, setCurrentDate] = useState(new Date())
	const { tasks, tags, refetch } = useAuth()

	const { execute } = useServerAction(createTask, {
		onSuccess: () => refetch(),
	})

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

				<Column size={12} className="flex items-center gap-2 flex-wrap">
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
				</Column>

				<Column size={12}>
					<TaskForm
						onSubmit={(note) => {
							execute({
								title: note.title!,
								tags: note.tags,
								content: note.content,
								date: note.date,
							})
						}}
						suggestions={tags}
					/>
				</Column>

				<Column size={12}>
					<TaskList
						list={(tasks.length > 0 ? tasks : initialTasks).filter((x) => {
							if (filterTags.length === 0) return true
							return x.tags.some((tag) => filterTags.includes(tag))
						})}
					/>
				</Column>
			</Grid>
		</main>
	)
}
