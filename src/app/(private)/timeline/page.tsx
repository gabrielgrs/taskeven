'use client'

import { getAuthenticatedUser } from '@/actions/auth'
import { Template } from './template'

export default async function Home() {
	const [authUser, err] = await getAuthenticatedUser()
	if (err) throw err
	return <Template tasks={authUser.tasks} />
}
