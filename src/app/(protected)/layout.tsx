import { ReactNode } from 'react'
import Footer from '~/components/shared/Footer'
import Navbar from '~/components/shared/Navbar'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-xl">{children}</div>
      <Footer className="px-4 bg-background/80 backdrop-blur-sm" />
    </>
  )
}
