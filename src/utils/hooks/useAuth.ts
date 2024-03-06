import { useQuery } from '@tanstack/react-query'
import { getAuthenticatedUser } from '~/actions/auth'

export default function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const user = await getAuthenticatedUser()
      return user
    },
  })

  return {
    user,
    isLoading,
  }
}
