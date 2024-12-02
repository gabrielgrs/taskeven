'use client'

import Grid from '@/components/Grid'
import Column from '@/components/Grid/Column'
import { NoteCard } from '../../../../../components/note-card'

import { useNotes } from '@/hooks/use-notes'
import { useTags } from '@/hooks/use-tags'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { NoteForm } from '../../../../../components/note-form'
import { ScreenStatus } from './types'

export function Notes() {
	const [showOverlay, setShowOverlay] = useState(false)
	const [expandedNoteId, setExpandedNoteId] = useState('')
	const [screenStatus, setScreenStatus] = useState<ScreenStatus | null>(null)
	const { notes } = useNotes()
	const { tags } = useTags()

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
				{notes.map((note) => {
					if (expandedNoteId === note._id && screenStatus === 'editing') {
						return (
							<motion.div key={note._id} layoutId={note._id} className="z-10">
								<NoteForm
									onSubmit={() => {}}
									onCancel={() => setScreenStatus(null)}
									tagOptions={tags}
									forceOpen
									initialValues={note}
								/>
							</motion.div>
						)
					}
					return (
						<NoteCard
							key={note._id}
							identifier={note._id}
							title={note.title}
							content={note.content}
							tags={note.tags}
							date={note.date}
							isExpanded={expandedNoteId === note._id}
							screenStatus={screenStatus}
							setScreenStatus={setScreenStatus}
							onClickExpand={() => {
								setExpandedNoteId((p) => (p === note._id ? '' : note._id))
								setShowOverlay((p) => !p)
							}}
						/>
					)
				})}
			</Column>
		</Grid>
	)
}
