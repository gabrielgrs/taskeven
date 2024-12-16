'use client'

import { DatePicker } from '@/components/date-picker'
import { InputDropdown } from '@/components/input-dropdown'
import { Button } from '@/components/ui/button'
import { TaskSchema } from '@/libs/mongoose/schemas/task'
import { cn } from '@/libs/utils'
import { generateTimeValuesArray, timeValueToMinutes } from '@/utils/date'
import { requiredField } from '@/utils/messages'
import dayjs from 'dayjs'
import { X } from 'lucide-react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Input } from '../../ui/input'

type TaskForm = Pick<TaskSchema, 'title' | 'date' | 'duration'> & {
	time: string
	tag: string
	_id?: string
}

type Props = {
	onCancel?: () => void
	onSubmit: (values: TaskForm) => Promise<[unknown, unknown]>
	initialValues?: Partial<TaskForm>
	suggestions: string[]
	isExpanded?: boolean
	isSubmitting: boolean
	className?: string
}

const defaultValues: TaskForm = {
	title: '',
	tag: '',
	duration: 0,
	date: new Date(),
	time: '',
}

export function TaskForm({
	onSubmit: onSubmitFromParent,
	initialValues = {},
	onCancel,
	suggestions,
	isSubmitting,
	className,
}: Props) {
	const { handleSubmit, register, control, reset } = useForm<typeof defaultValues>({
		mode: 'all',
		defaultValues: {
			...defaultValues,
			...initialValues,
		},
	})

	const durationValue = useWatch({ control, name: 'duration' })
	const timeOptions = generateTimeValuesArray(15)
	const isEdition = Boolean(initialValues?._id)

	const onSubmit = async (values: typeof defaultValues) => {
		try {
			const timeInMinutes = timeValueToMinutes(values.time)

			const date = dayjs(values.date).startOf('day').add(timeInMinutes, 'minute').toDate()
			const [, error] = await onSubmitFromParent({
				...values,
				duration: Number(values.duration ?? 0),
				date,
			})
			if (error) throw error
			reset()
			if (onCancel) onCancel()
		} catch {}
	}

	return (
		<form
			onSubmit={handleSubmit((values) => onSubmit(values))}
			className={cn('relative flex gap-2 flex-col p-2 rounded-lg bg-foreground/5', className)}
		>
			{isEdition && onCancel && (
				<button className="text-muted-foreground flex items-center text-sm place-self-end" onClick={() => onCancel()}>
					Close <X size={16} />
				</button>
			)}

			<div className="flex items-center gap-2">
				<Input {...register('title', { required: requiredField })} placeholder="Type your task" />

				<Controller
					control={control}
					name="tag"
					render={({ field }) => {
						return (
							<InputDropdown
								placeholder="Tag name"
								name={field.name}
								value={field.value}
								onChange={field.onChange}
								options={suggestions.map((item) => ({ label: item, value: item }))}
							/>
						)
					}}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,180px,max-content] gap-2">
				<Controller
					control={control}
					rules={{
						required: requiredField,
					}}
					name="date"
					render={({ field }) => {
						return (
							<DatePicker
								name={field.name}
								value={field.value}
								onChange={(event) => field.onChange(event.target.value)}
								placeholder="Date"
								triggerClassName="w-full"
							/>
						)
					}}
				/>

				{/* <Input {...register('time', { required: requiredField })} className=" w-full" type="time" /> */}
				<Controller
					control={control}
					name="time"
					render={({ field }) => {
						return (
							<InputDropdown
								autoComplete="off"
								placeholder="hh:mm"
								mask="99:99"
								onlyNumbers
								name={field.name}
								value={field.value}
								onChange={field.onChange}
								options={timeOptions}
							/>
						)
					}}
				/>

				<div className="relative">
					<Input
						{...register('duration', { min: 0, max: 24 })}
						mask="99"
						onlyNumbers
						className="w-full"
						placeholder="Duration"
					/>
					<span className="absolute top-[50%] translate-y-[-50%] right-2 bg-background text-muted-foreground text-sm px-1 rounded">
						{durationValue > 1 ? 'Hours' : 'Hour'}
					</span>
				</div>

				<Button loading={isSubmitting} className="w-full md:w-max min-w-lg self-end">
					{isEdition ? 'Update' : 'Add'} task
				</Button>
			</div>
		</form>
	)
}
