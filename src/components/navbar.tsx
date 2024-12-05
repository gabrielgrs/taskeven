'use client'

import { useMainCTA } from '@/hooks/use-main-cta'
import { cn } from '@/libs/utils'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import NextLink from 'next/link'
import { type ReactNode } from 'react'
import Link from './Link'

const AnimatedLink = motion(NextLink)

function Section({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				'flex items-center justify-center bg-card h-full p-2 shadow rounded-full duration-500 hover:shadow-lg',
				className,
			)}
		>
			{children}
		</div>
	)
}

const navItemStyles =
	'relative hover:bg-foreground/10 duration-500 h-full px-4 rounded-full flex items-center justify-center'

function NavItem({ children, href }: { children: ReactNode; href: string }) {
	return (
		<Link href={href} className={navItemStyles}>
			{children}
		</Link>
	)
}

export function Navbar() {
	const { theme, setTheme } = useTheme()
	const { showOnNavbar } = useMainCTA()

	return (
		<nav className="w-full sticky top-0 backdrop-blur-lg h-16 py-2 px-8 flex justify-between items-center gap-4 z-50 font-semibold">
			<Section>
				<Link href="/" className="flex items-center gap-2">
					<div className="h-8 w-8 rounded-full bg-foreground" />
					<span className="font-semibold hidden md:flex">Taskeven</span>
				</Link>
			</Section>
			<div className="flex items-center gap-2 h-full">
				<Section>
					<NavItem href="/">Home</NavItem>
					<NavItem href="#pricing">Pricing</NavItem>
					<button
						type="button"
						className={cn(navItemStyles, 'h-8')}
						onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
					>
						{theme === 'dark' ? 'Lighten' : 'Darken'}
					</button>
				</Section>
				{showOnNavbar && (
					<AnimatedLink
						whileHover={{ rotate: -3, scale: 1.1 }}
						layoutId="main-cta"
						href="/auth"
						className="bg-foreground flex items-center gap-2 group text-background h-full px-4 rounded-full"
					>
						Access
						<span className="group-hover:translate-x-1 duration-500">
							<ArrowRight size={20} />
						</span>
					</AnimatedLink>
				)}
			</div>
		</nav>
	)
}
