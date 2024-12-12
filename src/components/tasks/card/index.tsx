import { onCompleteOrUncompleteTask, removeTask, updateTask } from '@/actions/task'
import { Modal } from '@/components/modal'
import { Tag } from '@/components/tag'
import { TaskForm } from '@/components/tasks/form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useTasks } from '@/hooks/use-tasks'
import { TaskSchema } from '@/libs/mongoose/schemas/task'
import { cn } from '@/libs/utils'
import dayjs from 'dayjs'
import { Edit, Ellipsis, Trash, X } from 'lucide-react'
import { motion } from 'motion/react'
import { Dispatch } from 'react'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { ScreenStatus } from '../list/types'

type Props = {
	isExpanded: boolean
	screenStatus: ScreenStatus | null
	onCancel: () => void
	task: TaskSchema
	setScreenStatus: Dispatch<ScreenStatus | null>
	onExpand: () => void
}

export function TaskCard({ screenStatus, isExpanded, task, setScreenStatus, onExpand }: Props) {
	const { refetch, tags } = useTasks()

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

	return (
		<motion.div
			layoutId={task._id}
			className={cn(
				'bg-secondary flex items-center justify-between gap-2 p-2 rounded border border-secondary-foreground/10 shadow',
				isExpanded ? 'z-50' : 'z-10',
			)}
		>
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
						{!screenStatus && (
							<motion.div
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								transition={{ delay: 0.2, duration: 0.3 }}
								className="flex items-center gap-2"
							>
								<Modal
									title="Update task"
									trigger={
										<Button size="icon" variant="outline">
											<Edit />
										</Button>
									}
								>
									<TaskForm
										isSubmitting={updateTaskAction.isPending}
										onSubmit={(note) => {
											updateTaskAction.execute({
												_id: task._id,
												...note,
											})
										}}
										initialValues={{
											_id: task._id,
											title: task.title,
											tags: task.tags.map((x) => ({ label: x, value: x })),
										}}
										suggestions={tags}
									/>
								</Modal>
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
									onClick={() => removeTaskAction.execute({ _id: task._id })}
									className="text-destructive"
									loading={screenStatus === 'deleting'}
								>
									Confirm
								</Button>
							</motion.div>
						)}
					</div>
				)}
				{!isExpanded && task.date && (
					<span className="font-semibold opacity-50 text-sm">{dayjs(task.date).format('HH:mm')}</span>
				)}
				<Button
					size="icon"
					variant="ghost"
					onClick={() => {
						onExpand()
					}}
				>
					{isExpanded ? <X /> : <Ellipsis />}
				</Button>
			</div>
		</motion.div>
	)
}
