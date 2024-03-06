'use client'

import { useTheme } from 'next-themes'
import { Palette } from 'lucide-react'
import FocusMode from '~/components/FocusMode'
import { Button } from '~/components/ui/button'
import Logo from '../Logo'

export default function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="grid grid-cols-3 px-2 md:px-4 items-center gap-4 h-20 z-50 backdrop-blur-md sticky top-0">
      <Logo />

      <div className="justify-self-center">
        <FocusMode />
      </div>

      <Button
        className="w-max justify-self-end"
        variant="outline"
        onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
      >
        <Palette />
      </Button>
    </header>
  )
}
