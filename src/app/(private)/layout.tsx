import { Navbar } from '@/components/navbar'
import { ReactNode } from 'react'

export default function PrivateLayout({ children }: { children: ReactNode }) {
	return (
		<div className="square-bg">
			<Navbar />
			<div className="mx-auto max-w-7xl px-4 pt-16 pb-4">{children}</div>
		</div>
	)
}
