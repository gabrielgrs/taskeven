import { type TaskSchema } from '@/libs/mongoose/schemas/user'

export function sortTasks(tasks: TaskSchema[]) {
	return tasks.sort((a, b) => {
		if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime()
		if (a.date) return -1
		if (b.date) return 1
		return 0
	})
}
