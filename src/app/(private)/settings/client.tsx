'use client'

import { getUserSettingsData } from '@/actions/user'
import { Column, Grid } from '@/components/grid'
import { InputDropdown } from '@/components/input-dropdown'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/use-auth'
import { UserSchema } from '@/libs/mongoose/schemas/user'
import { cn } from '@/libs/utils'
import { ServerActionResponse } from '@/utils/action'
import { generateTimeValuesArray, timeValueToMinutes } from '@/utils/date'
import { invalidValue, requiredField } from '@/utils/messages'
import { calculatePercentage } from '@/utils/number'
import { Rocket } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

type Props = {
	defaultValues: Partial<UserSchema>
	type?: 'Onboarding'
	subscriptionUsage: ServerActionResponse<typeof getUserSettingsData>['subscriptionUsage']
}

export function SettingsClient({ defaultValues, type, subscriptionUsage }: Props) {
	const { register, handleSubmit, control } = useForm({ defaultValues })
	const { onUpdateUser, isUpdating } = useAuth()
	const { push } = useRouter()
	const startTimeValue = useWatch({ control, name: 'startTime' })
	const timeOptions = generateTimeValuesArray(15)

	const onSubmit = async (values: typeof defaultValues) => {
		const [, err] = await onUpdateUser({
			startTime: values.startTime!,
			endTime: values.endTime!,
			name: values.name!,
		})

		if (err) toast.error('Failed to update user')
		if (type === 'Onboarding') push('/')
		toast.success('Data saved with success')
	}

	return (
		<main>
			<Grid>
				<Column size={12}>
					<h1 className="text-2xl">{type || 'Settings'}</h1>
					{type === 'Onboarding' && <p>Fill fields to finish onboarding</p>}
				</Column>
				<Column size={12}>
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
								<Controller
									control={control}
									name="startTime"
									rules={{
										required: requiredField,
										validate: (value) => {
											if (!value) return requiredField
											const a = timeValueToMinutes(value)
											if (a === -1) return invalidValue
											return undefined
										},
									}}
									render={({ field }) => {
										return (
											<InputDropdown
												ref={register(field.name).ref}
												value={field.value}
												onChange={field.onChange}
												options={timeOptions}
												mask="99:99"
												placeholder="hh:mm"
												onlyNumbers
											/>
										)
									}}
								/>
							</Column>

							<Column size={6}>
								<Label>End day time</Label>
								<Controller
									control={control}
									name="endTime"
									rules={{
										required: requiredField,
										validate: (value) => {
											if (!value) return requiredField
											const endTimeMinutes = timeValueToMinutes(value)
											if (endTimeMinutes === -1) return invalidValue
											const startTimeMinutes = timeValueToMinutes(startTimeValue ?? '')
											if (startTimeMinutes >= endTimeMinutes) return invalidValue
											return undefined
										},
									}}
									render={({ field }) => {
										return (
											<InputDropdown
												ref={register(field.name).ref}
												value={field.value}
												onChange={field.onChange}
												options={timeOptions}
												mask="99:99"
												placeholder="hh:mm"
												onlyNumbers
											/>
										)
									}}
								/>
							</Column>

							<Column size={12} className="flex justify-end">
								<Button type="submit" loading={isUpdating}>
									Save
								</Button>
							</Column>
						</Grid>
					</form>
				</Column>

				{type !== 'Onboarding' && (
					<Column size={12}>
						<Grid className="bg-foreground/10 rounded-lg p-4">
							<Column size={12}>
								<h1 className="text-lg font-semibold">Usage and subscription</h1>
							</Column>
							<Column size={6}>
								<Grid>
									<Column size={12}>Montly tasks</Column>
									<Column size={12}>
										<span>
											{subscriptionUsage.tasks.current} / {subscriptionUsage.tasks.total}
										</span>
										<Progress
											value={calculatePercentage(subscriptionUsage.tasks.current, subscriptionUsage.tasks.total)}
										/>
									</Column>
									<Column size={12}>Montly Insights</Column>
									<Column size={12}>
										<span>
											{subscriptionUsage.insights.current} / {subscriptionUsage.insights.total}
										</span>
										<Progress
											value={calculatePercentage(subscriptionUsage.insights.current, subscriptionUsage.insights.total)}
										/>
									</Column>
								</Grid>
							</Column>
							<Column size={6}>
								<Grid>
									{defaultValues.stripeSubscriptionId && (
										<Column size={12} className="flex justify-end">
											<Link
												href={process.env.STRIPE_CUSTOMER_PORTAL}
												className={cn(buttonVariants({ variant: 'outline' }))}
											>
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
					</Column>
				)}
			</Grid>
		</main>
	)
}
