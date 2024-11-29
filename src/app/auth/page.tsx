'use client'

import Grid from '@/components/Grid'
import Column from '@/components/Grid/Column'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Check, Mail, MailOpen } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

const AnimatedButton = motion.create(Button)

const AnimatedInput = motion.create(Input)

export default function Page() {
	const [isWaitingCode, setIsWaitingCode] = useState(false)
	const [isButtonHover, setIsButtonHover] = useState(false)
	const [needRegister, setNeedRegister] = useState(false)

	return (
		<main className="flex items-center justify-center min-h-[calc(100vh-200px)]">
			<div className="bg-card min-w-80 px-4 py-10 rounded-lg shadow-md">
				<Grid>
					<Column size={12}>
						<motion.h1
							whileHover={{
								rotate: [0, 5, 10, -5, 10, -5, 10],
								scale: 1.1,
							}}
							className="text-4xl font-semibold text-center"
						>
							Auth
						</motion.h1>
					</Column>
					<Column size={12} className={cn('flex flex-col gap-4 duration-500', needRegister ? 'h-36' : 'h-10')}>
						<Input placeholder="Type your e-mail" />
						{needRegister && (
							<>
								<AnimatedInput
									initial={{ scale: 0 }}
									animate={{ scale: 1, type: 'spring', transition: { delay: 0.1 } }}
									placeholder="Type your full name"
								/>
								<AnimatedInput
									initial={{ scale: 0 }}
									animate={{ scale: 1, type: 'spring', transition: { delay: 0.3 } }}
									placeholder="Type your full name"
								/>
							</>
						)}
					</Column>
					<Column size={12}>
						<AnimatedButton
							layoutId="main-cta"
							onMouseEnter={() => setIsButtonHover(true)}
							onMouseLeave={() => setIsButtonHover(false)}
							onClick={() => {
								setIsWaitingCode((p) => !p)
								setNeedRegister(true)
							}}
							className="w-full group"
							initial={{ x: -100, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: 100, opacity: 0 }}
							transition={{ duration: 1 }}
						>
							{!isWaitingCode && (
								<span className="group relative w-4 h-4">
									<AnimatePresence>
										{isButtonHover ? (
											<motion.div
												initial={{ opacity: 0 }}
												animate={{ opacity: 1, transition: {} }}
												exit={{ opacity: [1], translateX: [0, 100], transition: { duration: 4 } }}
											>
												<MailOpen strokeWidth={3} />
											</motion.div>
										) : (
											<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
												<Mail strokeWidth={3} />
											</motion.div>
										)}
									</AnimatePresence>
								</span>
							)}

							<span className={cn('duration-500', !isWaitingCode ? 'translate-x-2' : '-translate-x-2')}>
								Sign in with email
							</span>
							{isWaitingCode && (
								<motion.div initial={{ opacity: 0, translateY: '-10px' }} animate={{ opacity: 1, translateY: '0px' }}>
									<Check
										strokeWidth={3}
										className="group-hover:scale-150 group-hover:translate-x-2 group-hover:rotate-12 duration-500"
									/>
								</motion.div>
							)}
						</AnimatedButton>
					</Column>
				</Grid>
			</div>
		</main>
	)
}
