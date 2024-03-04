'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

type Props = {
  isAuthenticated: boolean
  message: string
}

export default function ErrorUI({ isAuthenticated, message }: Props) {
  return (
    <main className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1>{message}</h1> <br />
      <Link
        href={isAuthenticated ? '/app' : '/'}
        className="flex items-center gap-2 hover:gap-3 duration-500 opacity-70"
      >
        <ChevronLeft />
        Back to {isAuthenticated ? 'app' : 'home'}
      </Link>
    </main>
  )
}
