'use client'

import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TaskSchema } from '@/libs/mongoose/schemas/task'
import { cn } from '@/libs/utils'
import { timeValueToMinutes } from '@/utils/date'
import { requiredField } from '@/utils/messages'
import dayjs from 'dayjs'
import { X } from 'lucide-react'
// import { Combobox } from '@/components/combobox'
import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Input } from '../../ui/input'

type TaskForm = Pick<TaskSchema, 'title' | 'date' | 'duration'> & {
	time: string
	tag: string
	_id?: string
}

type Props = {
	onCancel?: () => void
	onSubmit: (values: TaskForm) => void
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
	const [isCreateTag, setIsCreateTag] = useState(false)
	const { handleSubmit, register, control, reset } = useForm<typeof defaultValues>({
		mode: 'all',
		defaultValues: {
			tag: initialValues?.tag ?? '',
			title: initialValues?.title ?? '',
			date: initialValues?.date ?? undefined,
		},
	})

	const dateValue = useWatch({ control, name: 'date' })
	const durationValue = useWatch({ control, name: 'duration' })

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

			<div className="flex items-center gap-2">
				<Input
					{...register('title', { required: requiredField })}
					placeholder="Type your task"
					className="bg-secondary col-span-2"
				/>

				<Controller
					control={control}
					name="tag"
					render={({ field }) => {
						if (isCreateTag) {
							return (
								<div className="flex items-center gap-1">
									<Input
										name={field.name}
										value={field.value.toString()}
										onChange={(event) => field.onChange(event.target.value.trim().replace(/ /g, ''))}
										className="bg-secondary w-[160px]"
										placeholder="Tag name"
									/>
									<button className="text-muted-foreground" onClick={() => setIsCreateTag(false)}>
										<X />
									</button>
								</div>
							)
						}

						return (
							<Select>
								<SelectTrigger className={cn('w-[220px] bg-secondary', !field.value && 'text-muted-foreground')}>
									<SelectValue placeholder="Select" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{suggestions.map((suggestion) => (
											<SelectItem value={suggestion} key={suggestion}>
												{suggestion}
											</SelectItem>
										))}
									</SelectGroup>
									<Button size="sm" variant="outline" className="w-full" onClick={() => setIsCreateTag(true)}>
										New tag
									</Button>
								</SelectContent>
							</Select>
						)
					}}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,180px,max-content] gap-2">
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

				<div className="relative">
					<Input
						{...register('duration', { min: 0, max: 24 })}
						mask="99"
						onlyNumbers
						className="bg-secondary w-full"
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
