import { getUserSettingsData } from '@/actions/user'
import { SettingsClient } from './client'

export const dynamic = 'force-dynamic'

type Props = {
	searchParams: Promise<{ type?: 'Onboarding' }>
}
export default async function Page({ searchParams }: Props) {
	const [data, error] = await getUserSettingsData()
	if (error) throw error

	const { type } = await searchParams

	return <SettingsClient defaultValues={data.user} type={type} subscriptionUsage={data.subscriptionUsage} />
}
