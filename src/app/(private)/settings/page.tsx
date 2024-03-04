import { getAuthenticatedUser } from '~/actions/auth'
import SettingsUI from '~/components/Settings'

export default async function SettingsPage() {
  const user = await getAuthenticatedUser()

  return <SettingsUI defaultValues={user!} />
}
