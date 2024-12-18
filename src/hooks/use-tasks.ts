'use client'

import { getTasks } from '@/actions/task'
import { TaskSchema } from '@/libs/mongoose/schemas/task'
import { sortTasks } from '@/utils/sort'
import { useQuery } from '@tanstack/react-query'

type Data = {
	tasks: TaskSchema[]
	tags: string[]
	error?: any
}

export function useTasks() {
	const { data, refetch } = useQuery({
		queryKey: ['tasks'],
		queryFn: async (): Promise<Data> => {
			const [data, error] = await getTasks()
			if (error)
				return {
					tasks: [],
					tags: [],
					error,
				}

			const tasks = sortTasks(data)
			const tags = tasks
				.reduce((acc: string[], curr) => {
					if (!acc.includes(curr.tag)) acc.push(curr.tag)
					return acc
				}, [])
				.filter((x) => Boolean(x))

			return {
				tasks,
				tags,
			}
		},
	})

	return {
		tasks: data?.tasks ?? ([] as TaskSchema[]),
		tags: data?.tags ?? ([] as string[]),
		error: data?.error,
		refetch,
	}
}
