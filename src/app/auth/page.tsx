import { getAuthenticatedUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { AuthUI } from './ui'

export default async function Page() {
	const [, err] = await getAuthenticatedUser()
	if (!err) return redirect('/timeline')

	return <AuthUI />
}
