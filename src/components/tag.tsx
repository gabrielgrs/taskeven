import { cn } from '@/libs/utils'
import type { ReactNode } from 'react'

type Props = {
	children: ReactNode
	className?: string
}

export function Tag({ children, className }: Props) {
	return (
		<div
			className={cn(
				'px-1 py-0 font-medium text-sm rounded-lg text-center bg-foreground/5 text-foreground/80',
				className,
			)}
		>
			{children}
		</div>
	)
}
