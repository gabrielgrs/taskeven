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
	hideUndated: false,
	hideCompleted: false,
	startTime: '',
	endTime: '',
}

type Props = {
	onSubmit: (values: typeof defaultValues) => void
	isSubmitting: boolean
	initialValues?: Partial<typeof defaultValues>
}

export function SettingsUI({ onSubmit, isSubmitting, initialValues }: Props) {
	const { register, handleSubmit, control } = useForm({ defaultValues: { ...defaultValues, ...initialValues } })
	const startTimeValue = useWatch({ control, name: 'startTime' })

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Grid>
				<Column size={12}>
					<Controller
						control={control}
						name="hideUndated"
						render={({ field }) => {
							return (
								<>
									<Label htmlFor={field.name}>Hide undated</Label>
									<br />
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

				<Column size={12}>
					<Label>Start time</Label>
					<Input {...register('startTime', { required: requiredField })} type="time" className="max-w-[160px]" />
				</Column>

				<Column size={12}>
					<Label>End time</Label>
					<Input
						{...register('endTime', {
							required: requiredField,
							validate: (value) => {
								const startInMinutes = timeValueToMinutes(startTimeValue)
								const endInMinutes = timeValueToMinutes(value)
								return startInMinutes < endInMinutes
							},
						})}
						type="time"
						className="max-w-[160px]"
					/>
				</Column>

				<Column size={12} className="flex justify-end">
					<Button loading={isSubmitting}>Save settings</Button>
				</Column>
			</Grid>
		</form>
	)
}
