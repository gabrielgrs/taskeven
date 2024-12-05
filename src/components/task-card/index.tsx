import { Tag } from '@/components/tag'
import { Button } from '@/components/ui/button'
import { TaskSchema } from '@/libs/mongoose/schemas/user'
import { cn } from '@/libs/utils'
import dayjs from 'dayjs'
import { Edit, Expand, Trash, X } from 'lucide-react'
import { motion } from 'motion/react'
import { Dispatch } from 'react'
import { ScreenStatus } from '../../app/(private)/timeline/template/task-list/types'

type Props = Pick<TaskSchema, 'title' | 'content' | 'tags' | 'date'> & {
	identifier: string
	onClickExpand: () => void
	setScreenStatus: Dispatch<ScreenStatus | null>
	screenStatus: ScreenStatus | null
	isExpanded: boolean
	onRemove: () => void
}

export function TaskCard({
	identifier,
	title,
	content,
	tags,
	date,
	onClickExpand,
	onRemove,
	setScreenStatus,
	isExpanded,
	screenStatus,
}: Props) {
	return (
		<motion.div
			layoutId={identifier}
			className={cn('flex flex-col gap-4 bg-card p-4 rounded-3xl z-0 shadow h-max', isExpanded ? 'z-50' : 'z-10')}
		>
			<div className="grid grid-cols-[auto,40px] gap-2">
				<div>
					<span className="font-medium opacity-50 text-sm">{date ? dayjs(date).format('MM/DD/YYYY') : '-'}</span>
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
				<Button
					size="icon"
					onClick={() => {
						onClickExpand()
					}}
				>
					{isExpanded ? <X /> : <Expand />}
				</Button>
			</div>
			<div className="flex items-center gap-2 flex-wrap">
				{tags.map((tag, index) => (
					<Tag key={`${tag}_${index}`}>{tag}</Tag>
				))}
			</div>
			{isExpanded && (
				<div className="flex items-center">
					{!screenStatus && (
						<motion.div
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -10 }}
							transition={{ delay: 0.2, duration: 0.3 }}
							className="flex items-center gap-2"
						>
							<Button size="icon" variant="outline" onClick={() => setScreenStatus('editing')}>
								<Edit />
							</Button>
							<Button size="icon" variant="outline" onClick={() => setScreenStatus('selected_to_delete')}>
								<Trash className="text-destructive" />
							</Button>
						</motion.div>
					)}

					{(screenStatus === 'selected_to_delete' || screenStatus === 'deleting') && (
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 50 }}
							transition={{ delay: 0.2, duration: 0.3 }}
							className="flex items-center gap-2"
						>
							<Button variant="outline" onClick={() => setScreenStatus(null)}>
								Cancel
							</Button>
							<Button
								variant="outline"
								onClick={() => onRemove()}
								className="text-destructive"
								loading={screenStatus === 'deleting'}
							>
								Confirm
							</Button>
						</motion.div>
					)}
				</div>
			)}
		</motion.div>
	)
}
