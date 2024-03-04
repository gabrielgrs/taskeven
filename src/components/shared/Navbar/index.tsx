'use client'

import Link from 'next/link'
import { Rocket } from 'lucide-react'
import FocusMode from '~/components/FocusMode'
import { buttonVariants } from '~/components/ui/button'
import useAuth from '~/utils/hooks/useAuth'
import { cn } from '~/utils/shadcn'
import Logo from '../Logo'
import ListSelector from './ListSelector'
import UserInfo from './UserInfo'

const navigationItemStyles =
  'hover:bg-foreground/10 flex items-center duration-500 px-2 md:px-5 py-1 md:py-2 rounded-lg relative opacity-70 hover:opacity-100'

export default function Navbar({ isPublic = false }) {
  const { user, isLoading } = useAuth()

  return (
    <header
      data-public={isPublic}
      className="grid data-[public=true]:grid-cols-[max-content,auto,max-content] md:data-[public=true]:grid-cols-3 grid-cols-[auto,max-content] px-2 md:px-4 items-center gap-4 h-20 z-50 backdrop-blur-md sticky top-0"
    >
      <div className="flex gap-1 sm:gap-2 items-center">
        <Logo />
        {!isPublic && user && (
          <>
            <span className="opacity-50 hidden sm:block">{'/'}</span>
            <ListSelector />
          </>
        )}
      </div>

      {isPublic && (
        <div className="flex justify-start md:justify-center">
          <Link href="#about" className={navigationItemStyles}>
            About
          </Link>

          <Link href="#pricing" className={navigationItemStyles}>
            Pricing
          </Link>
        </div>
      )}

      <div className="flex justify-self-end items-center">
        {!isPublic && !isLoading && user && (
          <div className="flex items-center gap-4">
            <FocusMode />
            <UserInfo user={user} />
          </div>
        )}

        {isPublic && (
          <Link href="/app" className={cn(buttonVariants({ variant: 'link' }), 'rounded-full group px-1')}>
            Go to app
            <Rocket size={16} className="group-hover:-translate-y-2 group-hover:scale-125 duration-500" />
          </Link>
        )}
      </div>
    </header>
  )
}
