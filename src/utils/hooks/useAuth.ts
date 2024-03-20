import { useQuery } from '@tanstack/react-query'
import { getTokenData } from '~/actions/auth'

export default function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const user = await getTokenData()
      return user
    },
  })

  return {
    user,
    isLoading,
  }
}
