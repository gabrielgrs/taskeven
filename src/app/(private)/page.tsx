import { getAuthenticatedUser } from '@/actions/auth'
import { TasksUI } from '@/components/tasks'
import { redirect } from 'next/navigation'
import { Main } from './main'

export default async function Home() {
	const [user] = await getAuthenticatedUser()

	if (user) {
		const needOnBoarding = !user.name || !user.startTime || !user.endTime

		if (needOnBoarding) return redirect('/settings?type=Onboarding')

		return (
			<main className="mx-auto max-w-xl">
				<TasksUI />
			</main>
		)
	}

	return (
		<div className="mx-auto max-w-xl">
			<main>
				<Main />
			</main>
			<div className="pointer-events-none opacity-40 blur-[1px]">
				<TasksUI />
			</div>
		</div>
	)
}
