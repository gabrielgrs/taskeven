'use client'

import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import { TaskSchema } from '@/libs/mongoose/schemas/task'
import { cn } from '@/libs/utils'
import { requiredField } from '@/utils/messages'
import { X } from 'lucide-react'
// import { Combobox } from '@/components/combobox'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { InputTags } from '../../input-tags'
import { Input } from '../../ui/input'

type TaskForm = Pick<TaskSchema, 'title' | 'date' | 'duration'> & {
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
		try {
			await onSubmitFromParent({
				...values,
				tags: values.tags.map((tag) => tag.label),
			})
			reset()
			if (onCancel) onCancel()
		} catch {}
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

			<div className="flex flex-col md:flex-row items-center gap-2">
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
					{...register('duration', { min: 0, max: 24 })}
					className="bg-secondary w-full"
					placeholder="Duration hours"
				/>

				<Button loading={isSubmitting} className="col-span-2 w-full md:w-max min-w-lg self-end">
					{isEdition ? 'Update' : 'Add'} task
				</Button>
			</div>
		</form>
	)
}
