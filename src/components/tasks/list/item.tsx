import { onCompleteOrUncompleteTask, removeTask, updateTask } from '@/actions/task'
import { TaskCard } from '@/components/tasks/card'
import { TaskForm } from '@/components/tasks/form'
import { useTasks } from '@/hooks/use-tasks'
import { TaskSchema } from '@/libs/mongoose/schemas/task'
import { motion } from 'motion/react'
import { Dispatch } from 'react'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { ScreenStatus } from './types'

type Props = {
	isExpanded: boolean
	screenStatus: ScreenStatus | null
	onCancel: () => void
	task: TaskSchema
	setScreenStatus: Dispatch<ScreenStatus | null>
	onExpand: () => void
}

export function TaskItem({ screenStatus, isExpanded, onCancel, task, setScreenStatus, onExpand }: Props) {
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
	if (isExpanded && screenStatus === 'editing') {
		return (
			<motion.div layoutId={task._id} className="z-10">
				<TaskForm
					isSubmitting={updateTaskAction.isPending}
					onSubmit={(values) => {
						updateTaskAction.execute({
							...values,
							_id: task._id,
							date: task.date ? new Date(task.date) : undefined,
						})
					}}
					onCancel={() => onCancel()}
					suggestions={tags}
					initialValues={{
						...task,
						tags: task.tags.map((tag) => ({ label: tag, value: tag })),
					}}
				/>
			</motion.div>
		)
	}

	return (
		<TaskCard
			identifier={task._id}
			title={task.title}
			tags={task.tags}
			date={task.date}
			completed={task.completed}
			isExpanded={isExpanded}
			screenStatus={screenStatus}
			setScreenStatus={setScreenStatus}
			onClickExpand={() => onExpand()}
			onComplete={(complete) =>
				onCompleteOrUncompleteTaskAction.execute({
					_id: task._id,
					completed: complete,
				})
			}
			onRemove={() => removeTaskAction.execute({ _id: task._id })}
		/>
	)
}
