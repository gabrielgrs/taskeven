import { cn } from '~/utils/shadcn'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-accent-foreground', className)} {...props} />
}

export { Skeleton }
