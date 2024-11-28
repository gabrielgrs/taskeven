'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import Link from './Link'

function Section({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div className={cn('flex items-center justify-center gap-2 bg-card h-full p-2 shadow rounded-full', className)}>
			{children}
		</div>
	)
}

function NavItem({ children, href }: { children: ReactNode; href: string }) {
	return (
		<Link
			href={href}
			className="relative hover:bg-foreground/10 duration-500 h-full px-4 rounded-full flex items-center justify-center"
		>
			{children}
		</Link>
	)
}

export function Navbar() {
	return (
		<nav className="w-full sticky top-0 backdrop-blur-lg h-16 py-2 px-8 flex justify-between items-center gap-4 z-50">
			<Section>
				<span className="h-8 w-8 rounded-full bg-black" />
				<span className="font-semibold">Navbar</span>
			</Section>
			<div className="flex items-center gap-2 h-full">
				<Section>
					<NavItem href="/">Home</NavItem>
					<NavItem href="/">About</NavItem>
				</Section>
				<button type="button" className="bg-foreground text-background h-full px-4 rounded-full">
					Sign up
				</button>
			</div>
		</nav>
	)
}
