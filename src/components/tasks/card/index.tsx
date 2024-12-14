import { archiveTask, updateTask } from '@/actions/task'
import { AreYouSure } from '@/components/are-you-sure'
import { Tag } from '@/components/tag'
import { Button } from '@/components/ui/button'
import { useTasks } from '@/hooks/use-tasks'
import { TaskSchema } from '@/libs/mongoose/schemas/task'
import { cn } from '@/libs/utils'
import dayjs from 'dayjs'
import { Archive, Edit, Expand, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { TaskForm } from '../form'

type Props = {
	task: TaskSchema
}

export function TaskCard({ task }: Props) {
	const { refetch, tags } = useTasks()
	const [isExpanded, setIsExpanded] = useState(false)
	const [isEditing, setIsEditing] = useState(false)

	const archiveTaskAction = useServerAction(archiveTask, {
		onError: () => toast.error('Failed to archive'),
		onSuccess: async () => {
			await refetch()
			toast.success('Task archived with success')
		},
	})

	const updateTaskAction = useServerAction(updateTask, {
		onError: () => toast.error('Failed to update task'),
		onSuccess: async () => {
			await refetch()
			toast.success('Task updated with success')
		},
	})

	if (isEditing) {
		return (
			<motion.div layoutId={task._id}>
				<TaskForm
					isSubmitting={updateTaskAction.isPending}
					onSubmit={(values) => updateTaskAction.execute({ ...values, _id: task._id })}
					onCancel={() => setIsEditing(false)}
					initialValues={{
						...task,
						time: dayjs(task.date).format('HH:mm'),
					}}
					suggestions={tags}
				/>
			</motion.div>
		)
	}

	return (
		<motion.div
			layoutId={task._id}
			className={cn(
				'bg-secondary dark:bg-secondary/30 p-2 rounded shadow border border-secondary/20',
				isExpanded ? 'z-50' : 'z-10',
			)}
		>
			<div className="flex justify-between w-full">
				<div className="flex items-center gap-2">
					<div>
						<div className="font-semibold">{task.title}</div>
						<Tag>{task.tag}</Tag>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{isExpanded && (
						<div className="flex items-center">
							<motion.div
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								transition={{ delay: 0.2, duration: 0.3 }}
								className="flex items-center gap-2"
							>
								<Button size="icon" variant="outline" onClick={() => setIsEditing(true)}>
									<Edit />
								</Button>

								<AreYouSure
									onConfirm={() => archiveTaskAction.execute({ _id: task._id })}
									loading={archiveTaskAction.isPending}
									message={`Are you sure you want to archive the task ${task.title}?`}
								>
									<Button size="icon" variant="outline">
										<Archive className="text-destructive" />
									</Button>
								</AreYouSure>
							</motion.div>
						</div>
					)}
					{!isExpanded && task.date && (
						<div className="flex flex-col items-end">
							<span className="font-semibold opacity-50 text-sm">{dayjs(task.date).format('HH:mm')}</span>
							{<span className="font-semibold opacity-50 text-sm">{task.duration}h duration</span>}
						</div>
					)}
					<Button
						size="icon"
						variant="ghost"
						onClick={() => {
							setIsExpanded((p) => !p)
						}}
					>
						{isExpanded ? <X /> : <Expand />}
					</Button>
				</div>
			</div>
		</motion.div>
	)
}
