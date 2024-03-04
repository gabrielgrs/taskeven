import { ReactNode } from 'react'
import { cn } from '~/utils/shadcn'

export default function Description({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('opacity-70', className)}>{children}</p>
}
