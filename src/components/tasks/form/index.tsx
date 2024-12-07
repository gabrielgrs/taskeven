'use client'

import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import { TaskSchema } from '@/libs/mongoose/schemas/user'
import { requiredField } from '@/utils/messages'
// import { Combobox } from '@/components/combobox'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { InputTags } from '../../input-tags'
import { Input } from '../../ui/input'

type TaskForm = Pick<TaskSchema, 'title' | 'date'> & { tags: { value: string; label: string }[]; _id?: string }

type Props = {
	onCancel?: () => void
	onSubmit: (values: Omit<TaskForm, 'tags'> & { tags: string[] }) => void
	initialValues?: Partial<TaskForm>
	suggestions: string[]
	isExpanded?: boolean
}

const defaultValues: TaskForm = {
	title: '',
	tags: [],
	date: undefined,
}

export function TaskForm({ onSubmit: onSubmitFromParent, initialValues, onCancel, suggestions }: Props) {
	const { handleSubmit, register, control, reset, formState } = useForm<typeof defaultValues>({
		mode: 'all',
		defaultValues: {
			tags: initialValues?.tags || [],
			title: initialValues?.title ?? '',
			date: initialValues?.date ?? undefined,
		},
	})

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
		await onSubmitFromParent({
			...values,
			tags: values.tags.map((tag) => tag.label),
		})
		reset({ title: '', date: undefined })
		if (onCancel) onCancel()
	}

	return (
		<form onSubmit={handleSubmit((values) => onSubmit(values))} className="relative flex gap-2 flex-col">
			<Input
				{...register('title', { required: requiredField })}
				placeholder="Type your task"
				className="bg-secondary col-span-2"
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
								triggerClassName="w-full md:w-[200px] bg-secondary"
							/>
						)
					}}
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

				<Button loading={formState.isSubmitting} className="col-span-2 w-full md:w-max">
					{initialValues?._id ? 'Update' : 'Add'} task
				</Button>
			</div>
		</form>
	)
}
