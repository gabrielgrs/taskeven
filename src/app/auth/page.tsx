'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { authenticate } from '@/actions/auth'
import Link from '@/components/Link'
import { Grid } from '@/components/grid'
import { Column } from '@/components/grid/column'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { requiredField } from '@/utils/messages'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { DotPattern } from './dot-pattern'

export default function Page() {
	const { push } = useRouter()
	const form = useForm({ defaultValues: { email: '', code: '' } })
	const [isWaitingTheCode, setIsWaitingTheCode] = useState(false)

	const action = useServerAction(authenticate, {
		onError: () => toast.error('Failed to sign in'),
		onSuccess: ({ data }) => {
			if (data.status === 'WAITING_FOR_CODE') {
				toast.info('Check your email for the code')
				return setIsWaitingTheCode(true)
			}
			if (data.status === 'AUTHORIZED') {
				toast.success('Signed in with success! Redirecting you...')
				return push('/')
			}
		},
	})

	return (
		<div className="min-h-max md:min-h-screen flex flex-col-reverse md:grid grid-cols-2">
			<main className="w-full h-full flex flex-col items-center justify-center py-20 md:py-0">
				<div className="w-full mx-auto max-w-sm">
					<h1>Welcome to Taskeven</h1>
					<p className="text-foreground/50 font-thin">Description</p>
					<form onSubmit={form.handleSubmit(action.execute)}>
						<Grid>
							<Column size={12} key={String(isWaitingTheCode)}>
								<motion.div
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
								>
									{isWaitingTheCode ? (
										<Controller
											control={form.control}
											name="code"
											render={({ field }) => (
												<InputOTP
													maxLength={6}
													value={field.value}
													onChange={field.onChange}
													containerClassName="flex justify-between w-full"
												>
													<InputOTPGroup>
														<InputOTPSlot index={0} />
														<InputOTPSlot index={1} />
														<InputOTPSlot index={2} />
													</InputOTPGroup>
													<InputOTPSeparator />
													<InputOTPGroup>
														<InputOTPSlot index={3} />
														<InputOTPSlot index={4} />
														<InputOTPSlot index={5} />
													</InputOTPGroup>
												</InputOTP>
											)}
										/>
									) : (
										<Input {...form.register('email', { required: requiredField })} placeholder="Type your email" />
									)}
								</motion.div>
							</Column>
							<Column size={12}>
								<Button type="submit" className="w-full" loading={action.isPending}>
									{isWaitingTheCode ? 'Validate code' : 'Sign in'}
								</Button>
							</Column>
						</Grid>
					</form>
					{/* <div className="flex items-center gap-2 justify-between my-8 opacity-50">
						<span className="w-full h-[1px] bg-foreground" />
						Or
						<span className="w-full h-[1px] bg-foreground" />
					</div>
					<button type="button" className="bg-white text-black w-full rounded-lg h-10">
						Google
					</button> */}
				</div>
			</main>

			<aside className="p-4 md:p-8 h-full w-full">
				<div className="relative w-full rounded-lg h-full bg-primary/10 px-4 py-8 flex flex-col justify-between gap-4">
					<Link href="/" className="flex items-center gap-2 group">
						<ArrowLeft className="group-hover:-translate-x-4 duration-500" />
						Taskeven
					</Link>
					<div>
						<h1 className="max-w-xl">Get Everything You Want</h1>
						<h2 className="text-muted-foreground">Lorem ipsum dolor</h2>
					</div>
					<DotPattern className="p-4 rounded opacity-50" />
				</div>
			</aside>
		</div>
	)
}
