import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

function Grid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={twMerge('grid grid-cols-12 gap-4 w-full', className)}>{children}</div>
}

export default Grid
