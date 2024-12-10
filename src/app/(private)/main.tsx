'use client'

import { useAuth } from '@/hooks/use-auth'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'

export function Main() {
	const { user } = useAuth()

	if (user) return null

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="flex flex-col items-center justify-center text-center gap-4 py-[10vh]"
		>
			<h1 className="text-2xl md:text-5xl text-foreground/50 hover:text-muted-foreground/20 duration-500 group">
				Keep the{' '}
				<span className="text-foreground dark:text-primary group-hover:font-medium duration-500 relative">focus</span>{' '}
				on what is important!
			</h1>
			<h2 className="text-muted-foreground font-light">
				A minimalist life manager to help you stay organized <br /> without the clutter.
			</h2>
			<Link
				href="/auth"
				className="bg-primary border text-primary-foreground px-4 py-2 duration-500 hover:scale-110 hover:-rotate-6 rounded-tl-none rounded-br-none rounded-tr-2xl rounded-bl-2xl flex items-center gap-2 group"
			>
				Get Started Now
				<ArrowRight size={20} className="group group-hover:translate-x-1 duration-500" />
			</Link>
		</motion.div>
	)
}
