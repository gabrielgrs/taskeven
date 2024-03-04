import { getAuthenticatedUser } from '~/actions/auth'
import AuthUI from '~/components/Auth'

export default async function AuthPage() {
  const authenticatedUser = await getAuthenticatedUser()

  return <AuthUI isAuthenticated={Boolean(authenticatedUser)} />
}
