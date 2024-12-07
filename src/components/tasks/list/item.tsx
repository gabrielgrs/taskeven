import { removeTask, updateTask } from '@/actions/task'
import { TaskCard } from '@/components/tasks/card'
import { TaskForm } from '@/components/tasks/form'
import { useAuth } from '@/hooks/use-auth'
import { TaskSchema } from '@/libs/mongoose/schemas/user'
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
	const { refetch, tags } = useAuth()

	const { execute } = useServerAction(updateTask, {
		onError: () => toast.error('Failed to update task'),
		onSuccess: () => refetch(),
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
					onSubmit={(values) => {
						execute({
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
			isExpanded={isExpanded}
			screenStatus={screenStatus}
			setScreenStatus={setScreenStatus}
			onClickExpand={() => onExpand()}
			onRemove={() => removeTaskAction.execute({ _id: task._id })}
		/>
	)
}
