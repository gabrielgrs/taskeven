import { ReactNode } from 'react'
import Footer from '~/components/shared/Footer'
import Navbar from '~/components/shared/Navbar'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-3xl py-8">{children}</div>
      <Footer className="relative px-4" />
    </>
  )
}
