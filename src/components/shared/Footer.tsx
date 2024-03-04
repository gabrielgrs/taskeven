'use client'

import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Moon, Sun } from 'lucide-react'
import { cn } from '~/utils/shadcn'

export default function Footer({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <footer className={cn('flex gap-2 py-6 flex-col text-sm border-t-[1px] border-foreground/10', className)}>
      <div className="text-foreground/60">
        Designed by{' '}
        <Link href="https://github.com/gabrielgrs" target="_blank" className="text-foreground/80">
          gabrielgrs
        </Link>
      </div>
      <div className="flex gap-3 items-center flex-wrap max-w-[calc(100vw-140px)]">
        <Link href="/" className="text-foreground/60 hover:opacity-90 duration-500 whitespace-nowrap	">
          Home
        </Link>
        <Link href="/docs" className="text-foreground/60 hover:opacity-90 duration-500 whitespace-nowrap	">
          Docs
        </Link>
        <Link href="/terms-of-service" className="text-foreground/60 hover:opacity-90 duration-500 whitespace-nowrap	">
          Terms of Service
        </Link>
        <Link href="/privacy-policy" className="text-foreground/60 hover:opacity-90 duration-500 whitespace-nowrap	">
          Privacy policy
        </Link>

        <button
          aria-label="Switch theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-foreground/60 hover:opacity-90 duration-500 flex items-center gap-1 whitespace-nowrap"
        >
          <Sun className="hidden dark:block" size={16} />
          <span className="hidden dark:block">Light theme</span>
          <Moon className="dark:hidden block" size={16} />
          <span className="dark:hidden block">Dark theme</span>
        </button>
      </div>
    </footer>
  )
}
