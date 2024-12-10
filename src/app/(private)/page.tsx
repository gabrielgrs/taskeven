import { getAuthenticatedUser } from '@/actions/auth'
import { TasksUI } from '@/components/tasks'
import { Main } from './main'

export default async function Home() {
	const [user] = await getAuthenticatedUser()

	if (user) {
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
