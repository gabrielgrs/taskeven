import { getUserSettingsData } from '@/actions/user'
import { SettingsClient } from './client'

export const dynamic = 'force-dynamic'

type Props = {
	searchParams?: {
		type?: 'Onboarding'
	}
}
export default async function Page({ searchParams }: Props) {
	const [data, error] = await getUserSettingsData()
	if (error) throw error

	return (
		<SettingsClient defaultValues={data.user} type={searchParams?.type} subscriptionUsage={data.subscriptionUsage} />
	)
}
