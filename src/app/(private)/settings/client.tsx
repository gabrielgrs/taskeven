'use client'

import { Column, Grid } from '@/components/grid'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { UserSchema } from '@/libs/mongoose/schemas/user'
import { cn } from '@/libs/utils'
import { Rocket } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type Props = {
	defaultValues: Partial<UserSchema>
	type?: 'Onboarding'
}

export function SettingsClient({ defaultValues, type }: Props) {
	const { register, handleSubmit } = useForm({ defaultValues })
	const { onUpdateUser, isUpdating } = useAuth()
	const { push } = useRouter()

	const onSubmit = async (values: typeof defaultValues) => {
		const [, err] = await onUpdateUser({
			startTime: values.startTime!,
			endTime: values.endTime!,
			name: values.name!,
		})

		if (err) toast.error('Failed to update user')
		return push('/')
	}

	return (
		<main>
			<Grid>
				<Column size={12}>
					<h1 className="text-2xl">{type || 'Settings'}</h1>
				</Column>
				<Column size={6}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Grid className="bg-foreground/10 rounded-lg p-4">
							<Column size={12}>
								<h1 className="text-lg font-semibold">User data</h1>
							</Column>
							<Column size={6}>
								<Label>Email</Label>
								<Input {...register('email')} type="email" disabled placeholder="Type your email" />
							</Column>

							<Column size={6}>
								<Label>User name</Label>
								<Input {...register('name', { required: true })} placeholder="Type your name" />
							</Column>

							<Column size={6}>
								<Label>Start day time</Label>
								<Input {...register('startTime', { required: true })} type="time" />
							</Column>

							<Column size={6}>
								<Label>End day time</Label>
								<Input {...register('endTime', { required: true })} type="time" />
							</Column>

							<Column size={12} className="flex justify-end">
								<Button type="submit" loading={isUpdating}>
									Save
								</Button>
							</Column>
						</Grid>
					</form>
				</Column>

				<Column size={6}>
					<Grid className="bg-foreground/10 rounded-lg p-4">
						<Column size={12}>
							<h1 className="text-lg font-semibold">Subscription</h1>
						</Column>

						{defaultValues.stripeSubscriptionId && (
							<Column size={12} className="flex justify-end">
								<Link href={process.env.STRIPE_CUSTOMER_PORTAL} className={cn(buttonVariants({ variant: 'outline' }))}>
									Manager subscription
								</Link>
							</Column>
						)}

						{!defaultValues.stripeSubscriptionId && (
							<>
								<Column size={12}>Subscription advantages:</Column>
								<Column size={12}>
									<ul>
										<li>Teste</li>
										<li>Teste</li>
										<li>Teste</li>
										<li>Teste</li>
									</ul>
								</Column>
								<Column size={12} className="flex justify-end">
									<Button variant="outline">
										Get subscribed! <Rocket />
									</Button>
								</Column>
							</>
						)}
					</Grid>
				</Column>
			</Grid>
		</main>
	)
}
