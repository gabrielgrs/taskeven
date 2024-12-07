import { Tag } from '@/components/tag'
import { Button } from '@/components/ui/button'
import { TaskSchema } from '@/libs/mongoose/schemas/user'
import { cn } from '@/libs/utils'
import dayjs from 'dayjs'
import { Edit, Pencil, Trash, X } from 'lucide-react'
import { motion } from 'motion/react'
import { Dispatch } from 'react'
import { Checkbox } from '../../ui/checkbox'
import { ScreenStatus } from '../list/types'

type Props = Pick<TaskSchema, 'title' | 'tags' | 'date'> & {
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
			className={cn(
				'bg-secondary flex items-center justify-between gap-2 p-2 rounded border border-secondary-foreground/10 shadow',
				isExpanded ? 'z-50' : 'z-10',
			)}
		>
			<div className="flex items-center gap-2">
				<Checkbox className="w-5 h-5" />
				<div className="font-semibold">{title}</div>
				<span className="font-medium opacity-50 text-sm">{date ? dayjs(date).format('MM/DD/YYYY') : '-'}</span>
				{tags.map((tag, index) => (
					<Tag key={`${tag}_${index}`}>{tag}</Tag>
				))}
			</div>
			<div className="flex items-end gap-2">
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
				<Button
					size="icon"
					onClick={() => {
						onClickExpand()
						setScreenStatus('editing')
					}}
				>
					{isExpanded ? <X /> : <Pencil />}
				</Button>
			</div>
		</motion.div>
	)
}
