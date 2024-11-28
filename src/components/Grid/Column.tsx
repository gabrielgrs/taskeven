import type { ReactNode } from 'react'

// Must be in the code to be transpiled of tailwind
type Columns =
	| 'md:col-span-1'
	| 'md:col-span-2'
	| 'md:col-span-3'
	| 'md:col-span-4'
	| 'md:col-span-5'
	| 'md:col-span-6'
	| 'md:col-span-7'
	| 'md:col-span-8'
	| 'md:col-span-9'
	| 'md:col-span-10'
	| 'md:col-span-11'
	| 'md:col-span-12'

type ColumnProps = {
	children: ReactNode
	size: number
	className?: string
}

function Column({ children, size, className }: ColumnProps) {
	const cols = `md:col-span-${size}` as Columns
	return <div className={`col-span-12 ${cols} ${className}`}>{children}</div>
}

export default Column
