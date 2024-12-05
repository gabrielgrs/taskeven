'use client'

import Grid from '@/components/Grid'
import Column from '@/components/Grid/Column'
import { TaskCard } from '../../../../../components/task-card'

import { getAuthenticatedUser } from '@/actions/auth'
import { useAuth } from '@/hooks/use-tasks'
import { cn } from '@/libs/utils'
import { combineTags } from '@/utils/tags'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { NoteForm } from '../../../../../components/task-form'
import { ScreenStatus } from './types'

type Props = {
	list: NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>['0']>['tasks']
}

export function Tasks({ list }: Props) {
	const [showOverlay, setShowOverlay] = useState(false)
	const [expandedNoteId, setExpandedNoteId] = useState('')
	const [screenStatus, setScreenStatus] = useState<ScreenStatus | null>(null)
	const { user } = useAuth()

	const tagOptions = combineTags(user?.tasks.map((item) => item.tags))

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
				{(user?.tasks || list).map((task) => {
					if (expandedNoteId === task._id && screenStatus === 'editing') {
						return (
							<motion.div key={task._id} layoutId={task._id} className="z-10">
								<NoteForm
									onSubmit={() => {}}
									onCancel={() => setScreenStatus(null)}
									tagOptions={tagOptions}
									forceOpen
									initialValues={task}
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
						/>
					)
				})}
			</Column>
		</Grid>
	)
}
