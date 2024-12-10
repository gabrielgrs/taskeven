import { cn } from '@/libs/utils'
import type { ReactNode } from 'react'

type Props = {
	children: ReactNode
	// backgroundColor: string
	className?: string
}

export function getContrastColor(bgColor: string): string {
	const hex = bgColor.replace('#', '')
	const r = Number.parseInt(hex.slice(0, 2), 16)
	const g = Number.parseInt(hex.slice(2, 4), 16)
	const b = Number.parseInt(hex.slice(4, 6), 16)
	const brightness = (r * 299 + g * 587 + b * 114) / 1000
	return brightness > 128 ? '#010101' : '#f5f5f5'
}

export function Tag({ children, className }: Props) {
	// const fontColor = getContrastColor(backgroundColor)

	return (
		<div className={cn('px-1 py-0 font-medium text-sm rounded-lg', 'bg-foreground/5 text-foreground/80', className)}>
			{children}
		</div>
	)
}
