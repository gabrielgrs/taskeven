'use client'

import { Column, Grid } from '@/components/grid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { timeValueToMinutes } from '@/utils/date'
import { requiredField } from '@/utils/messages'
import { Controller, useForm, useWatch } from 'react-hook-form'

const defaultValues = {
	showOnlyDated: false,
	showUncompleted: false,
	hasWakeUpTime: false,
	hasSleepTime: false,
	wakeUpTime: '',
	capacity: 8,
	sleepTime: '',
}

type Props = {
	onSubmit: (values: typeof defaultValues) => void
	isSubmitting: boolean
	initialValues?: Partial<typeof defaultValues>
}

export function SettingsUI({ onSubmit, isSubmitting, initialValues }: Props) {
	const { register, handleSubmit, control } = useForm({ defaultValues: { ...defaultValues, ...initialValues } })
	const wakeUpTime = useWatch({ control, name: 'wakeUpTime' })
	const sleepTime = useWatch({ control, name: 'sleepTime' })

	return (
		<form
			onSubmit={handleSubmit((values) => {
				onSubmit({
					...values,
					wakeUpTime: values.hasWakeUpTime ? values.sleepTime : '',
					sleepTime: values.hasSleepTime ? values.wakeUpTime : '',
				})
			})}
		>
			<Grid>
				<Column size={12} className="flex items-center space-x-2">
					<Controller
						control={control}
						name="showOnlyDated"
						render={({ field }) => {
							return (
								<>
									<Label htmlFor={field.name}>Show without date</Label>
									<Switch
										id={field.name}
										checked={field.value}
										onCheckedChange={(checked) => field.onChange(checked)}
									/>
								</>
							)
						}}
					/>
				</Column>

				<Column size={12} className="flex items-center space-x-2">
					<Controller
						control={control}
						name="showUncompleted"
						render={({ field }) => {
							return (
								<>
									<Label htmlFor={field.name}>Show uncompleted</Label>
									<Switch
										id={field.name}
										checked={field.value}
										onCheckedChange={(checked) => field.onChange(checked)}
									/>
								</>
							)
						}}
					/>
				</Column>

				<Column size={12} className="flex items-center space-x-2">
					<Controller
						control={control}
						name="hasWakeUpTime"
						render={({ field }) => {
							return (
								<>
									<Label htmlFor={field.name}>Has wake time</Label>
									<Switch
										id={field.name}
										checked={field.value}
										onCheckedChange={(checked) => field.onChange(checked)}
									/>
									{Boolean(field.value) && (
										<Input
											{...register('wakeUpTime', {
												required: Boolean(field.value) && requiredField,
												validate: (value) => {
													const wakeUp = timeValueToMinutes(value)
													const sleep = timeValueToMinutes(sleepTime)

													return sleep > wakeUp ? undefined : 'Invalid wake up time'
												},
											})}
											className="w-[96px] text-sm text-muted-foreground"
											type="time"
										/>
									)}
								</>
							)
						}}
					/>
				</Column>

				<Column size={12} className="flex items-center space-x-2">
					<Controller
						control={control}
						name="hasSleepTime"
						render={({ field }) => {
							return (
								<>
									<Label htmlFor={field.name}>Has sleep time</Label>
									<Switch
										id={field.name}
										checked={field.value}
										onCheckedChange={(checked) => field.onChange(checked)}
									/>
									{Boolean(field.value) && (
										<Input
											{...register('sleepTime', {
												required: Boolean(field.value) && requiredField,
												validate: (value) => {
													const wakeUp = timeValueToMinutes(wakeUpTime)
													const sleep = timeValueToMinutes(value)

													return wakeUp < sleep ? undefined : 'Invalid sleep time'
												},
											})}
											className="w-[96px] text-sm text-muted-foreground"
											type="time"
										/>
									)}
								</>
							)
						}}
					/>
				</Column>

				<Column size={12}>
					<Label>Calendar daily capacity</Label>
					<Input
						{...register('capacity', { required: true, min: 1, max: 24 })}
						placeholder="Type a number"
						type="number"
					/>
				</Column>

				<Column size={12} className="flex justify-end">
					<Button loading={isSubmitting}>Save settings</Button>
				</Column>
			</Grid>
		</form>
	)
}
