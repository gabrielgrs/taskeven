'use client'

import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import { TaskSchema } from '@/libs/mongoose/schemas/task'
import { cn } from '@/libs/utils'
import { timeValueToMinutes } from '@/utils/date'
import { requiredField } from '@/utils/messages'
import dayjs from 'dayjs'
import { X } from 'lucide-react'
// import { Combobox } from '@/components/combobox'
import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { InputTags } from '../../input-tags'
import { Input } from '../../ui/input'

type TaskForm = Pick<TaskSchema, 'title' | 'date' | 'duration'> & {
	time: string
	tags: { value: string; label: string }[]
	_id?: string
}

type Props = {
	onCancel?: () => void
	onSubmit: (values: Omit<TaskForm, 'tags'> & { tags: string[] }) => void
	initialValues?: Partial<TaskForm>
	suggestions: string[]
	isExpanded?: boolean
	isSubmitting: boolean
	className?: string
}

const defaultValues: TaskForm = {
	title: '',
	tags: [],
	duration: 0,
	date: undefined,
	time: '',
}

export function TaskForm({
	onSubmit: onSubmitFromParent,
	initialValues,
	onCancel,
	suggestions,
	isSubmitting,
	className,
}: Props) {
	const { handleSubmit, register, control, reset } = useForm<typeof defaultValues>({
		mode: 'all',
		defaultValues: {
			tags: initialValues?.tags || [],
			title: initialValues?.title ?? '',
			date: initialValues?.date ?? undefined,
		},
	})

	const dateValue = useWatch({ control, name: 'date' })

	const isEdition = Boolean(initialValues?._id)

	useEffect(() => {
		const event = (event: KeyboardEvent) => {
			if (event.code === 'Escape') {
				if (onCancel) onCancel()
				reset({ title: '' })
			}
		}

		window.addEventListener('keydown', event)
		return () => {
			window.removeEventListener('keydown', event)
		}
	}, [onCancel, reset])

	const onSubmit = async (values: typeof defaultValues) => {
		const timeInMinutes = timeValueToMinutes(values.time)

		const date = values.date ? dayjs(values.date).startOf('day').add(timeInMinutes, 'minute').toDate() : undefined
		await onSubmitFromParent({
			...values,
			tags: values.tags.map((tag) => tag.label),
			date,
		})
		reset()
		if (onCancel) onCancel()
	}

	return (
		<form
			onSubmit={handleSubmit((values) => onSubmit(values))}
			className={cn('relative flex gap-2 flex-col p-2 rounded-lg', className)}
		>
			{isEdition && onCancel && (
				<button className="text-muted-foreground flex items-center text-sm place-self-end" onClick={() => onCancel()}>
					Close <X size={16} />
				</button>
			)}
			<Input
				{...register('title', { required: requiredField })}
				placeholder="Type your task"
				className="bg-secondary col-span-2"
			/>

			<Controller
				control={control}
				name="tags"
				render={({ field }) => {
					return (
						<InputTags
							options={suggestions.map((item) => ({ value: item, label: item }))}
							value={field.value}
							onChange={(tags) => field.onChange(tags)}
						/>
					)
				}}
			/>

			<div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,120px,max-content] gap-2">
				<Controller
					control={control}
					name="date"
					render={({ field }) => {
						return (
							<DatePicker
								name={field.name}
								value={field.value}
								onChange={(event) => field.onChange(event.target.value)}
								placeholder="Date"
								triggerClassName="bg-secondary w-full"
							/>
						)
					}}
				/>

				<Input
					{...register('time', { required: Boolean(dateValue) && requiredField })}
					className="bg-secondary w-full"
					type="time"
				/>

				<Input {...register('duration', { min: 0, max: 24 })} className="bg-secondary w-full" placeholder="Duration" />

				<Button loading={isSubmitting} className="w-full md:w-max min-w-lg self-end">
					{isEdition ? 'Update' : 'Add'} task
				</Button>
			</div>
		</form>
	)
}
