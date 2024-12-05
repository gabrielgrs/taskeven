'use client'

import { authWithEmail } from '@/actions/auth'
import Grid from '@/components/Grid'
import Column from '@/components/Grid/Column'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/libs/utils'
import { requiredField } from '@/utils/messages'
import { Check, Mail, MailOpen } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'

const AnimatedButton = motion.create(Button)

const AnimatedInput = motion.create(Input)

export function AuthUI() {
	const [isWaitingCode, setIsWaitingCode] = useState(false)
	const [isButtonHover, setIsButtonHover] = useState(false)
	const [needRegister, setNeedRegister] = useState(false)
	const { register, handleSubmit, control } = useForm({
		defaultValues: { email: '', name: '', terms: false, code: '' },
	})
	const { push } = useRouter()

	const { execute, isPending, data } = useServerAction(authWithEmail, {
		onSuccess: ({ data }) => {
			if (data.needRegister) {
				setNeedRegister(true)
				return toast.info('Finish your register')
			}

			if (data.codeSentToEmail) {
				setIsWaitingCode(true)
				return toast.info('Code sent to your e-mail')
			}

			if (data.success) {
				push('/timeline')
				return toast.success('Success! Redirecting you...')
			}
		},
		onError: (data) => {
			if (data.err.message === 'UNAUHTHORIZED') {
				return toast.error('Unauthorized')
			}

			return toast.error('Failed to authenticate')
		},
	})

	return (
		<main className="flex items-center justify-center min-h-[calc(100vh-200px)]">
			<form
				onSubmit={handleSubmit((data) => execute(data))}
				className="bg-card min-w-80 px-4 py-10 rounded-lg shadow-md"
			>
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
					<Column
						key={String(isWaitingCode)}
						size={12}
						className={cn('flex flex-col gap-4 duration-500', needRegister ? 'h-36' : 'h-10')}
					>
						{isWaitingCode ? (
							<AnimatedInput
								initial={{ x: 100, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								exit={{ x: -100, opacity: 0 }}
								{...register('code', { required: requiredField })}
								placeholder="Insert verification code"
							/>
						) : (
							<AnimatedInput
								initial={{ x: -100, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								exit={{ x: 100, opacity: 0 }}
								{...register('email', { required: requiredField })}
								placeholder="Type your e-mail"
							/>
						)}
						{needRegister && (
							<>
								<AnimatedInput
									{...register('name', { required: needRegister && requiredField })}
									initial={{ scale: 0 }}
									animate={{ scale: 1, type: 'spring', transition: { delay: 0.1 } }}
									placeholder="Type your full name"
								/>
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1, type: 'spring', transition: { delay: 0.3 } }}
									className="flex items-center gap-1 justify-center py-1"
								>
									<Controller
										control={control}
										name="terms"
										rules={{ required: needRegister && requiredField }}
										render={({ field }) => {
											return (
												<Checkbox
													name={field.name}
													checked={Boolean(field.value)}
													onCheckedChange={(checked) => field.onChange(checked)}
												/>
											)
										}}
									/>
									<Label>I read and agree to the terms</Label>
								</motion.div>
							</>
						)}
					</Column>
					<Column size={12}>
						<AnimatedButton
							loading={isPending || Boolean(data?.success)}
							type="submit"
							layoutId="main-cta"
							onMouseEnter={() => setIsButtonHover(true)}
							onMouseLeave={() => setIsButtonHover(false)}
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
								{isWaitingCode ? 'Verify code' : `Sign ${needRegister ? 'up' : 'in'} with email`}
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
			</form>
		</main>
	)
}
