'use client'

import Grid from '@/components/Grid'
import Column from '@/components/Grid/Column'
import { TaskCard } from '../../../../../components/task-card'

import { getAuthenticatedUser } from '@/actions/auth'
import { removeTask, updateTask } from '@/actions/task'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/libs/utils'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { TaskForm } from '../../../../../components/task-form'
import { ScreenStatus } from './types'

type Props = {
	list: NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>['0']>['tasks']
}

export function TaskList({ list }: Props) {
	const [showOverlay, setShowOverlay] = useState(false)
	const [expandedNoteId, setExpandedNoteId] = useState('')
	const [screenStatus, setScreenStatus] = useState<ScreenStatus | null>(null)
	const { refetch, tags } = useAuth()

	const { execute } = useServerAction(updateTask, {
		onError: () => toast.error('Failed to update task'),
		onSuccess: () => refetch(),
	})
	const removeTaskAction = useServerAction(removeTask, {
		onStart: () => setScreenStatus('deleting'),
		onError: () => {
			setScreenStatus('selected_to_delete')
			toast.error('Failed to remove task')
		},
		onSuccess: async () => {
			await refetch()
			setScreenStatus(null)
			toast.success('Task removed with success')
		},
	})

	useEffect(() => {
		const keyDownListener = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setExpandedNoteId('')
				setScreenStatus(null)
				setShowOverlay(false)
			}
		}
		window.addEventListener('keydown', keyDownListener)

		return () => {
			window.removeEventListener('keydown', keyDownListener)
		}
	}, [])

	if (list.length === 0) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-center">No tasks found</p>
			</div>
		)
	}

	return (
		<Grid>
			<Column size={12} className={cn('relative grid gap-4 bg-foreground/5 p-4 rounded-3xl')}>
				<AnimatePresence>
					{showOverlay && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.7 }}
							className="absolute inset-0 bg-black/50 z-10 rounded-3xl"
						/>
					)}
				</AnimatePresence>
				{list.map((task) => {
					if (expandedNoteId === task._id && screenStatus === 'editing') {
						return (
							<motion.div key={task._id} layoutId={task._id} className="z-10">
								<TaskForm
									onSubmit={(values) => {
										execute({
											...values,
											_id: task._id,
											date: task.date ? new Date(task.date) : undefined,
										})
									}}
									onCancel={() => setScreenStatus(null)}
									suggestions={tags}
									forceOpen
									initialValues={{
										...task,
										tags: task.tags.map((tag) => ({ text: tag, id: tag })),
									}}
								/>
							</motion.div>
						)
					}
					return (
						<TaskCard
							key={task._id}
							identifier={task._id}
							title={task.title}
							content={task.content}
							tags={task.tags}
							date={task.date}
							isExpanded={expandedNoteId === task._id}
							screenStatus={screenStatus}
							setScreenStatus={setScreenStatus}
							onClickExpand={() => {
								setExpandedNoteId((p) => (p === task._id ? '' : task._id))
								setShowOverlay((p) => !p)
							}}
							onRemove={() => removeTaskAction.execute({ _id: task._id })}
						/>
					)
				})}
			</Column>
		</Grid>
	)
}
