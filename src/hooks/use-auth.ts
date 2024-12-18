'use client'

import { getAuthenticatedUser } from '@/actions/auth'
import { updateUser } from '@/actions/user'
import { timeValueToMinutes } from '@/utils/date'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'

export function useAuth() {
	const {
		data: user,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['auth'],
		queryFn: async () => {
			const [data, err] = await getAuthenticatedUser()
			if (err) return null
			const total = timeValueToMinutes(data.endTime) - timeValueToMinutes(data.startTime)

			return {
				...data,
				capacity: total !== -1 ? total : 0,
			}
		},
	})

	const updateUserAction = useServerAction(updateUser, {
		onSuccess: async () => refetch(),
		onError: () => toast.error('Failed to update user'),
	})

	const onUpdateUser = async (data: { name: string; startTime: string; endTime: string }) => {
		return updateUserAction.execute(data)
	}

	return {
		user,
		isLoading,
		refetch,
		isUpdating: updateUserAction.isPending,
		onUpdateUser,
	}
}
