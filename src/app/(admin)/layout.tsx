import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getTokenData } from '~/actions/auth'

type Props = {
  children: ReactNode
}

export default async function AdminLayout({ children }: Props) {
  const user = await getTokenData()
  if (!user) return redirect('/logout')
  if (user.email !== process.env.AUTHENTICATED_USER) return redirect('/logout')

  return <div>{children}</div>
}
