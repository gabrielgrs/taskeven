'use client'

import Grid from '@/components/Grid'
import Column from '@/components/Grid/Column'
import { NoteCard } from './note-card'

import { useNotes } from '@/hooks/use-notes'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

export function Notes({ notesView }: { notesView: 'grid' | 'timeline' }) {
	const [showOverlay, setShowOverlay] = useState(false)
	const { notes } = useNotes()

	return (
		<Grid>
			<Column
				size={12}
				className={cn(
					'relative grid gap-4 bg-foreground/5 p-4 rounded-3xl',
					notesView === 'timeline' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
				)}
			>
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
				{notes.map((note) => (
					<NoteCard
						key={note._id}
						identifier={note._id}
						title={note.title}
						content={note.content}
						tags={note.tags}
						date={note.date}
						setShowOverlay={setShowOverlay}
						notesView={notesView}
					/>
				))}
			</Column>
		</Grid>
	)
}
