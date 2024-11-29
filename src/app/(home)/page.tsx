'use client'

import Grid from '@/components/Grid'
import Column from '@/components/Grid/Column'
import Link from '@/components/Link'
import { buttonVariants } from '@/components/ui/button'
import { useMainCTA } from '@/hooks/use-main-cta'
import { faker } from '@faker-js/faker'
import { ArrowRight, Check, Flame, Wind } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { NoteCard } from '../(private)/app/template/notes/note-card'
import { Note, Tag } from '../(private)/app/template/types'

const AnimatedLink = motion.create(NextLink)

const tags: Tag[] = [
	{
		_id: Math.random().toString(),
		name: 'Travel',
		backgroundColor: '#d9f99d',
	},
	{
		_id: Math.random().toString(),
		name: 'Business',
		backgroundColor: '#c7d2fe',
	},
	{
		_id: Math.random().toString(),
		name: 'Fitness',
		backgroundColor: '#ffe4e6',
	},
	{
		_id: Math.random().toString(),
		name: 'Home',
		backgroundColor: '#0ea5e9',
	},
]

const notes: Note[] = [
	{
		_id: Math.random().toString(),
		title: 'Book a hotel for vacation',
		content: 'Search for a beachfront hotel in Bali and check reviews. ',
		tags: [tags[0]],
		date: new Date('2024-11-10'),
	},

	{
		_id: Math.random().toString(),
		title: 'Fix the leaky faucet',
		content: 'Buy replacement parts for the kitchen faucet from the hardware store. ',
		tags: [tags[3]],
		date: new Date('2024-11-15'),
	},
	{
		_id: Math.random().toString(),
		title: 'Plan next hiking trip',
		content: 'Research trails in the Rockies.',
		tags: [tags[0], tags[2]],
		date: new Date('2024-11-22'),
	},
]

export default function Home() {
	const { showOnNavbar } = useMainCTA()

	return (
		<main>
			<section className="py-[10vh]">
				<motion.h1
					whileInView={{ y: [-100, 10, -10, 5], transition: { duration: 2 } }}
					className="text-center font-bold text-7xl text-primary"
				>
					Level up your life ~
				</motion.h1>
				<br />
				<motion.p
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1, x: [-200, 50, -10, 0], transition: { duration: 2, delay: 1 } }}
					className="mx-auto max-w-3xl font-semibold text-lg"
				>
					{faker.lorem.paragraph(5)}
				</motion.p>
				<div className="flex items-center justify-center py-8">
					{!showOnNavbar && (
						<AnimatedLink
							layoutId="main-cta"
							href="/auth"
							className="bg-foreground font-semibold flex items-center gap-2 group text-background px-4 rounded-full max-w-max h-12"
						>
							Access
							<span className="group-hover:translate-x-1 duration-500">
								<ArrowRight size={20} />
							</span>
						</AnimatedLink>
					)}
				</div>
			</section>

			<section className="my-12">
				<Grid>
					<Column size={4} className="flex flex-col gap-4">
						{notes.map((item, index) => (
							<motion.div
								key={item._id}
								whileInView={{ opacity: [0, 1], x: [-100, 0] }}
								transition={{ duration: 0.5, delay: index * 0.3 }}
							>
								<NoteCard
									identifier={item._id}
									title={item.title}
									tags={item.tags}
									content={item.content}
									setShowOverlay={() => {}}
									date={item.date}
									notesView="demo"
								/>
							</motion.div>
						))}
					</Column>

					<Column size={8}>
						<div className="bg-emerald-100 h-full rounded-lg p-4">
							<h2 className="text-3xl font-semibold">Welcome to Taskeven</h2>
							<br />
							<p className="font-medium">
								Stay organized with your notes, categorize them however you want using tags and don't lose focus with
								the timeline
							</p>
							<br />
							<Image
								src="https://placehold.co/900x500"
								alt="Placeholder image"
								width={900}
								height={500}
								className="rounded-sm"
							/>
						</div>
					</Column>
				</Grid>
			</section>

			<section className="my-12 bg-card shadow-sm p-8 rounded-lg" id="pricing">
				<h1 className="text-center  text-red-800 text-5xl font-medium mb-8">Pricing</h1>
				<Grid>
					<Column size={6}>
						<div className="rounded-lg border-2 border-foreground/10 p-4">
							<div className="flex items-center text-lg gap-2">
								<span className="bg-foreground/5 p-2 rounded">
									<Wind />
								</span>
								Free
							</div>
							<br />
							<div className="flex items-center gap-2">
								<span className="text-4xl font-semibold">$ 0</span>
								<span className="opacity-50">/ month</span>
							</div>
							<p className="py-2 text-sm">All the basics for start a organized life</p>
							<ul>
								{[
									'Unlimited use time',
									'Full customized note',
									'Full customized tags',
									'30 notes',
									'5 tags',
									'5 reminders',
								].map((item) => {
									return (
										<li key={item} className="flex items-center gap-1">
											<Check />
											{item}
										</li>
									)
								})}
							</ul>
							<br />
							<Link href="/app" className={buttonVariants({ variant: 'secondary', className: 'w-full' })}>
								Start using for free
							</Link>
						</div>
					</Column>

					<Column size={6}>
						<div className="rounded-lg border-4 border-red-300 p-4">
							<div className="flex items-center text-lg gap-2">
								<span className="bg-red-100 p-2 rounded">
									<Flame />
								</span>
								Paid
							</div>

							<br />
							<div className="flex items-center gap-2">
								<span className="text-4xl font-semibold">$ 9,99</span>
								<span className="opacity-50">/ month</span>
							</div>
							<p className="py-2 text-sm">Get full control of your life</p>
							<ul>
								{[
									'All free resources',
									'Unlimited notes',
									'Unlimited tags',
									'Unlimited reminders',
									'Early access to new features',
									'Priority support',
								].map((item) => {
									return (
										<li key={item} className="flex items-center gap-1">
											<Check />
											{item}
										</li>
									)
								})}
							</ul>
							<br />
							<Link href="/app" className={buttonVariants({ variant: 'default', className: 'w-full' })}>
								Start the entire experience
							</Link>
						</div>
					</Column>
				</Grid>
			</section>

			<footer className="h-16 font-medium w-full bg-primary flex items-center justify-center text-primary-foreground my-12 rounded-full">
				<div>
					Made with love by{' '}
					<a href="https://gabrielgrs.dev" target="_blank" className="underline underline-offset-4">
						gabrielgrs
					</a>
				</div>
			</footer>
		</main>
	)
}
