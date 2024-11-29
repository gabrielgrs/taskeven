import { Tag } from '@/components/tag'
import { Button } from '@/components/ui/button'
import { useTags } from '@/hooks/use-tags'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import { Edit, Expand, Trash, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { NoteForm } from '../note-form'
import type { Note } from '../types'

type Props = Pick<Note, 'title' | 'content' | 'tags' | 'date'> & {
	identifier: string
	setShowOverlay: Dispatch<SetStateAction<boolean>>
	notesView: 'grid' | 'timeline' | 'demo'
}

export function NoteCard({ identifier, title, content, tags, date, setShowOverlay, notesView }: Props) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const { tags: tagsList } = useTags()

	useEffect(() => {
		const keyDownListener = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsExpanded(false)
				setIsEditing(false)
				setShowOverlay(false)
			}
		}
		window.addEventListener('keydown', keyDownListener)

		return () => {
			window.removeEventListener('keydown', keyDownListener)
		}
	}, [setShowOverlay])

	if (isEditing) {
		return (
			<motion.div layoutId={identifier} className="z-10">
				<NoteForm
					onSubmit={() => {}}
					onCancel={() => setIsEditing(false)}
					tagOptions={tagsList}
					forceOpen
					initialValues={{ tags, title, _id: identifier, content, date }}
				/>
			</motion.div>
		)
	}

	return (
		<motion.div
			layoutId={identifier}
			className={cn(
				'flex flex-col gap-4 bg-card p-4 rounded-3xl z-0 shadow',
				isExpanded && notesView === 'grid' && 'z-20 col-span-1 md:col-span-2 lg:col-span-3',
				isExpanded && notesView === 'timeline' && 'z-20',
			)}
		>
			<div className="grid grid-cols-[auto,40px] gap-2">
				<div>
					<span className="font-medium opacity-50 text-sm">{date ? dayjs(date).format('DD/MM/YYYY') : '-'}</span>
					<div className="font-semibold">{title}</div>
					<p
						className={cn(
							'opacity-70 duration-500',
							isExpanded ? 'h-auto overflow-auto p-1' : 'h-auto max-h-12 overflow-hidden',
						)}
					>
						{content}
					</p>
				</div>
				{notesView !== 'demo' && (
					<Button
						size="icon"
						onClick={() => {
							setShowOverlay((p) => !p)
							setIsExpanded((p) => !p)
						}}
					>
						{isExpanded ? <X /> : <Expand />}
					</Button>
				)}
			</div>
			<div className="flex items-center gap-2 flex-wrap">
				{tags.map((tag) => (
					<Tag key={tag._id} backgroundColor={tag.backgroundColor}>
						{tag.name}
					</Tag>
				))}
			</div>
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ scaleY: 0, height: '0px' }}
						animate={{ scaleY: 1, height: '50px', transition: { delay: 0.3 } }}
						exit={{ scaleY: 0, height: '0px', transition: { delay: 0.125 } }}
						className="flex items-center gap-2"
					>
						<Button size="icon" variant="outline" onClick={() => setIsEditing(true)}>
							<Edit />
						</Button>
						<Button size="icon" variant="outline">
							<Trash className="text-destructive" />
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
