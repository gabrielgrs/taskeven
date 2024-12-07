import { TasksUI } from '@/components/tasks'

export default async function Home() {
	return (
		<main className="mx-auto max-w-xl">
			<TasksUI />
		</main>
	)
}
