'use client'

import Grid from '@/components/Grid'
import Column from '@/components/Grid/Column'
import { useMainCTA } from '@/hooks/use-main-cta'
import { faker } from '@faker-js/faker'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
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
						<motion.div
							whileInView={{ opacity: [0, 1], y: [100, 0] }}
							transition={{ duration: 0.5 }}
							className="bg-foreground/5 p-4 rounded-lg shadow-sm"
						>
							<h1 className="text-center  text-5xl font-medium mb-8">Frequently Asked Questions</h1>

							<motion.div
								whileInView={{ opacity: [0, 1], x: [-100, 0] }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className="flex flex-col gap-4"
							>
								<div className="bg-white p-4 rounded-lg shadow-sm">
									<h2 className="text-2xl font-medium">What is Taskeven?</h2>
									<p className="text-lg">
										Taskeven is a simple task management tool that helps you organize your day and stay focused.
									</p>
								</div>
								<div className="bg-white p-4 rounded-lg shadow-sm">
									<h2 className="text-2xl font-medium">How does it work?</h2>
									<p className="text-lg">
										Taskeven is very simple to use. You just add tasks, set a deadline and you will receive reminders
										until the task is completed.
									</p>
								</div>
								<div className="bg-white p-4 rounded-lg shadow-sm">
									<h2 className="text-2xl font-medium">How much does it cost?</h2>
									<p className="text-lg">
										Taskeven is free for personal use. For teams, we offer a simple pricing plan that is based on the
										number of users.
									</p>
								</div>
							</motion.div>
						</motion.div>
					</Column>
				</Grid>
			</section>

			<section className="my-12 bg-foreground/5 shadow-sm p-8 rounded-lg" id="pricing">
				<h1 className="text-center  text-red-800 text-5xl font-medium mb-8">Pricing</h1>
				<Grid>
					<Column size={6} className="bg-primary-foreground p-4 rounded-lg shadow-sm h-max">
						<h2 className="text-2xl font-medium">Personal</h2>
						<p className="text-lg">Limited to 1 user</p>
						<p className="text-3xl font-medium">$3.99/mo</p>
						<ul className="list-disc pl-4">
							<li>Unlimited notes</li>
							<li>Timeline view</li>
							<li>Tags</li>
							<li>Mobile app</li>
						</ul>
						<button className="bg-primary text-primary-foreground rounded-full px-4 py-2 mt-4 w-full">Buy</button>
					</Column>

					<Column size={6} className="bg-primary text-primary-foreground p-4 rounded-lg shadow-sm">
						<h2 className="text-2xl font-medium">Professional</h2>
						<p className="text-lg">Limited to 5 users</p>
						<p className="text-3xl font-medium">$9.99/mo</p>
						<ul className="list-disc pl-4">
							<li>Unlimited notes</li>
							<li>Timeline view</li>
							<li>Tags</li>
							<li>Mobile app</li>
							<li>Integration with Google Drive</li>
							<li>Unlimited storage</li>
						</ul>
						<button className="bg-primary-foreground text-primary rounded-full px-4 py-2 mt-4 w-full">Buy</button>
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
