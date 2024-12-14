import { getAuthenticatedUser } from '@/actions/auth'
import { SettingsClient } from './client'

type Props = {
	searchParams: {
		type?: 'Onboarding'
	}
}
export default async function Page({ searchParams }: Props) {
	const [user, error] = await getAuthenticatedUser()
	if (error) throw error

	return <SettingsClient defaultValues={user} type={searchParams.type} />
}
