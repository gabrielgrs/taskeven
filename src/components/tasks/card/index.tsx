import { onCompleteOrUncompleteTask, removeTask, updateTask } from '@/actions/task'
import { AreYouSure } from '@/components/are-you-sure'
import { Tag } from '@/components/tag'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useTasks } from '@/hooks/use-tasks'
import { TaskSchema } from '@/libs/mongoose/schemas/task'
import { cn } from '@/libs/utils'
import dayjs from 'dayjs'
import { Edit, Expand, Trash, X } from 'lucide-react'
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

	const onCompleteOrUncompleteTaskAction = useServerAction(onCompleteOrUncompleteTask, {
		onError: () => toast.error('Failed to update task'),
		onSuccess: async () => {
			await refetch()
			toast.success('Task updated with success')
		},
	})

	const updateTaskAction = useServerAction(updateTask, {
		onError: () => toast.error('Failed to update task'),
		onSuccess: async () => {
			await refetch()
			toast.success('Task updated with success')
		},
	})

	const removeTaskAction = useServerAction(removeTask, {
		onError: () => {
			toast.error('Failed to remove task')
		},
		onSuccess: async () => {
			await refetch()
			toast.success('Task removed with success')
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
					<Checkbox
						className="w-5 h-5"
						checked={task.completed}
						onCheckedChange={(state) =>
							onCompleteOrUncompleteTaskAction.execute({ _id: task._id, completed: Boolean(state) })
						}
					/>

					<div>
						<div className={cn('font-semibold', task.completed && 'line-through text-muted-foreground')}>
							{task.title}
						</div>
						<div className="flex items-center gap-2">
							{tags.map((tag, index) => (
								<Tag key={`${tag}_${index}`}>{tag}</Tag>
							))}
						</div>
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
									onConfirm={() => removeTaskAction.execute({ _id: task._id })}
									loading={removeTaskAction.isPending}
									message={`Are you sure you want to remove the task ${task.title}?`}
								>
									<Button size="icon" variant="outline">
										<Trash className="text-destructive" />
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
