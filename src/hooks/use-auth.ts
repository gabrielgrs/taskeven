'use client'

import { getAuthenticatedUser } from '@/actions/auth'
import { sortTasks } from '@/utils/sort'
import { useQuery } from '@tanstack/react-query'

export function useAuth() {
	const { data, refetch } = useQuery({
		queryKey: ['auth'],
		queryFn: async () => {
			const [user, err] = await getAuthenticatedUser()
			if (err) return null
			const tasks = sortTasks(user.tasks)
			const tags = user.tasks.reduce((acc: string[], curr) => {
				curr.tags.forEach((x) => {
					if (!acc.includes(x)) acc.push(x)
				})
				return acc
			}, [])
			return {
				user,
				tasks,
				tags,
			}
		},
	})

	if (!data) {
		return {
			user: null,
			tags: [],
			tasks: [],
			refetch,
		}
	}

	return {
		...data,
		refetch,
	}
}
