'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '~/actions/auth'
import FocusMode from '~/components/FocusMode'
import { Button, buttonVariants } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import useAuth from '~/utils/hooks/useAuth'
import Logo from '../Logo'

export default function Navbar() {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()

  return (
    <header className="flex justify-between md:grid md:grid-cols-3 px-2 md:px-4 items-center gap-4 h-20 z-50 backdrop-blur-md sticky top-0">
      <Logo />

      <div className="justify-self-center">{user && <FocusMode />}</div>

      <div className="w-max justify-self-end items-center flex gap-2">
        {isLoading && <Skeleton className="h-8 w-20" />}
        {user && (
          <Link href="/space" className={buttonVariants({ variant: 'link' })}>
            Spaces
          </Link>
        )}
        {!isLoading && !user && !pathname.includes('/auth') && (
          <Link href="/auth" className={buttonVariants({ variant: 'link' })}>
            Login
          </Link>
        )}
        {!isLoading && user && (
          <form action={() => logout().then(() => (window.location.href = '/'))}>
            <Button variant="link">Logout</Button>
          </form>
        )}
      </div>
    </header>
  )
}
