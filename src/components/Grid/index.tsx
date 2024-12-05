import type { ReactNode } from 'react'
export * from './column'

export function Grid({ children }: { children: ReactNode }) {
	return <div className="grid grid-cols-12 gap-4">{children}</div>
}
