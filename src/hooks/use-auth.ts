'use client'

import { getAuthenticatedUser, updateUser } from '@/actions/auth'
import { UserSchema } from '@/libs/mongoose/schemas/user'
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
			return data
		},
	})

	const updateUserAction = useServerAction(updateUser, {
		onSuccess: async () => {
			await refetch()
			toast.success('User updated with success')
		},
		onError: () => toast.error('Failed to update user'),
	})

	const onUpdateUser = async (data: Pick<UserSchema, 'capacity' | 'wakeUpTime' | 'sleepTime'>) =>
		updateUserAction.execute({
			capacity: data.capacity,
			wakeUpTime: data.wakeUpTime ?? -1,
			sleepTime: data.sleepTime ?? -1,
		})

	return {
		user,
		isLoading,
		refetch,
		isUpdating: updateUserAction.isPending,
		onUpdateUser,
	}
}
