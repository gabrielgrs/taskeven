'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '~/utils/shadcn'

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('relative w-full overflow-hidden rounded-full bg-neutral-300 dark:bg-neutral-700 h-2', className)}
    {...props}
  >
    {children}
  </ProgressPrimitive.Root>
))

const ProgressIndicator = ({ value, className }: { value?: number | null; className?: string }) => (
  <ProgressPrimitive.Indicator
    className={cn('h-full w-full flex-1 bg-primary transition-all', className)}
    style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
  />
)

Progress.displayName = ProgressPrimitive.Root.displayName
ProgressIndicator.displayName = ProgressPrimitive.Indicator.displayName

export { Progress, ProgressIndicator }
