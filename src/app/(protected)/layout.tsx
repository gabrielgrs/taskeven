import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getTokenData } from '~/actions/auth'

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const user = await getTokenData()
  if (!user) return redirect('/logout')

  return <>{children}</>
}
