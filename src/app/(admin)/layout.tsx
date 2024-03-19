import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getAuthenticatedUser } from '~/actions/auth'

type Props = {
  children: ReactNode
}

export default async function PrivateLayout({ children }: Props) {
  const authenticatedUser = await getAuthenticatedUser()
  if (!authenticatedUser) return redirect('/logout')
  if (authenticatedUser.role !== 'ADMIN') return redirect('/logout')

  return <div>{children}</div>
}
