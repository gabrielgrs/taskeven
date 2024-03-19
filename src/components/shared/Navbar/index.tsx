'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { logout } from '~/actions/auth'
import FocusMode from '~/components/FocusMode'
import { Button, buttonVariants } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import useAuth from '~/utils/hooks/useAuth'
import Logo from '../Logo'

type Props = {}

function Items({}: Props) {
  const [redirecting, setRedirecting] = useState(false)
  const { user, isLoading } = useAuth()
  const isAuthenticated = Boolean(user)
  const pathname = usePathname()

  if (pathname === '/auth') return null

  if (isLoading) return <Skeleton className="h-8 w-28" />

  if (isAuthenticated) {
    return (
      <>
        <FocusMode />
        <Link href="/spaces" className={buttonVariants({ variant: 'link' })}>
          Spaces
        </Link>
        <form action={() => logout().then(() => (window.location.href = '/'))}>
          <Button variant="link">Logout</Button>
        </form>
      </>
    )
  }

  return (
    <Link href="/auth" onClick={() => setRedirecting(true)} className={buttonVariants({ variant: 'link' })}>
      {redirecting ? <Loader2 size={20} className="animate-spin" /> : 'Login'}
    </Link>
  )
}

export default function Navbar() {
  return (
    <header className="flex justify-between px-2 items-center gap-4 h-20 z-50 backdrop-blur-md sticky top-0">
      <Logo />
      <nav className="h-full flex items-center">
        <Items />
      </nav>
    </header>
  )
}
