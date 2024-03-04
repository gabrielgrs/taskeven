import { ReactNode } from 'react'
import Navbar from '~/components/shared/Navbar'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar isPublic />
      <div className="mx-auto max-w-5xl px-4 pt-12 min-h-[calc(100vh-200px)]">{children}</div>
    </>
  )
}
