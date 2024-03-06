'use client'

import { useTheme } from 'next-themes'
import { Mail, Moon, Sun } from 'lucide-react'

export default function Footer() {
  const { theme, setTheme } = useTheme()

  return (
    <footer className="absolute flex w-full gap-4 justify-between left-0 bottom-0 p-2 text-sm text-muted-foreground/50 bakcdrop-blur-sm">
      <a href="https://github.com/gabrielgrs" target="_blank">
        Made with love by <span className="text-foreground opacity-70">gabrielgrs</span>
      </a>
      <div className="flex items-center gap-2">
        <button
          className="opacity-70 cursor-pointer hover:opacity-100 duration-500"
          onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
        >
          <Moon size={20} className="dark:hidden" />
          <Sun size={20} className="hidden dark:block" />
        </button>
        <a href="mailto:grxgabriel@gmail.com" className="opacity-70 cursor-pointer hover:opacity-100 duration-500">
          <Mail size={20} />
        </a>
      </div>
    </footer>
  )
}
