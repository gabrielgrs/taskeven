'use client'

import { cn } from '@/libs/utils'

import { signOut } from '@/actions/auth'
import { useAuth } from '@/hooks/use-auth'
import { ArrowRight, Lightbulb, LightbulbOff, Loader2, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Link from './Link'
import { Badge } from './ui/badge'
import { Button, buttonVariants } from './ui/button'

export function Navbar() {
	const [isFarFromTop, setIsFarmFromTop] = useState(false)
	const { user, isLoading, refetch } = useAuth()
	const { theme, setTheme } = useTheme()

	const isPro = Boolean(user?.stripeSubscriptionId)

	useEffect(() => {
		const onScroll = () => {
			setIsFarmFromTop(window.scrollY > 30)
		}

		onScroll()

		window.addEventListener('scroll', onScroll)
		return () => {
			window.removeEventListener('scroll', onScroll)
		}
	}, [])

	return (
		<nav
			className={cn(
				'w-full sticky top-0 py-2 px-8 flex justify-between items-center gap-4 z-50 font-semibold',
				isFarFromTop ? 'bg-background/80 backdrop-blur-lg h-16' : 'bg-primary/0 h-20',
			)}
		>
			<div className="flex items-center gap-2">
				<Link href="/" className="flex items-center gap-2">
					<div className="h-8 w-8 rounded-full bg-foreground" />
					<span className="font-semibold hidden md:flex">Taskeven</span>
				</Link>
				{user && (
					<Link href="/sync">
						<Badge className={cn('duration-500')}>{isPro ? 'Pro' : 'Free'}</Badge>
					</Link>
				)}
			</div>
			<div className="flex items-center gap-1 h-full">
				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
				>
					{theme === 'dark' ? <Lightbulb /> : <LightbulbOff />}
				</Button>
				{user && (
					<Button variant="link" className="group" onClick={() => signOut().then(() => refetch())}>
						Sign out <LogOut className="group-hover:translate-x-1 duration-500" />
					</Button>
				)}

				{isLoading && <Loader2 className="animate-spin" />}

				{!user && !isLoading && (
					<Link href="/auth" className={cn(buttonVariants(), 'group')}>
						Sign in <ArrowRight className="group-hover:translate-x-1 duration-500" />
					</Link>
				)}
			</div>
		</nav>
	)
}
