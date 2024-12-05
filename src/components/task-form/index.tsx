'use client'

import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import { TaskSchema } from '@/libs/mongoose/schemas/user'
import { cn } from '@/libs/utils'
import { requiredField } from '@/utils/messages'
// import { Combobox } from '@/components/combobox'
import { type Tag as TypeTag } from 'emblor'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useController, useForm, useWatch } from 'react-hook-form'
import { InputTags } from '../input-tags'

type TaskForm = Pick<TaskSchema, 'title' | 'content' | 'date'> & { tags: TypeTag[]; _id?: string }

type Props = {
	onCancel?: () => void
	onSubmit: (values: Omit<TaskForm, 'tags'> & { tags: string[] }) => void
	initialValues?: Partial<TaskForm>
	suggestions: string[]
	forceOpen?: boolean
}

const defaultValues: TaskForm = {
	title: '',
	content: '',
	tags: [],
	date: undefined,
}

export function TaskForm({
	onSubmit: onSubmitFromParent,
	initialValues,
	onCancel,
	forceOpen = false,
	suggestions,
}: Props) {
	const [isOpen, setIsOpen] = useState(forceOpen)
	const { handleSubmit, register, control, reset, formState } = useForm<typeof defaultValues>({
		mode: 'all',
		defaultValues: {
			tags: initialValues?.tags || [],
			title: initialValues?.title ?? '',
			content: initialValues?.content || '',
			date: initialValues?.date ?? undefined,
		},
	})

	useEffect(() => {
		const event = (event: KeyboardEvent) => {
			if (event.code === 'Escape') {
				if (onCancel) onCancel()
				reset({ title: '' })
				setIsOpen(false)
			}
		}

		window.addEventListener('keydown', event)
		return () => {
			window.removeEventListener('keydown', event)
		}
	}, [onCancel, reset])

	const taskValue = useWatch({ name: 'title', control })
	// const dateValue = useWatch({ name: 'date', control })

	const onSubmit = async (values: typeof defaultValues) => {
		await onSubmitFromParent({
			...values,
			tags: values.tags.map((tag) => tag.text),
		})
		reset({ title: '', date: undefined })
		setIsOpen(false)
		if (onCancel) onCancel()
	}

	const titleRegister = register('title', {
		required: requiredField,
	})
	const dateController = useController({
		name: 'date',
		control,
	})
	const contentValue = useWatch({ name: 'content', control })

	const isInteractinve = isOpen || Boolean(taskValue || contentValue)

	return (
		<form onSubmit={handleSubmit((values) => onSubmit(values))}>
			<fieldset
				data-focus={isOpen}
				className="border-2 border-primary/10 data-[focus=true]:border-primary/70 duration-500 rounded-lg bg-background"
			>
				<motion.div
					className={cn(
						'overflow-hidden duration-500',
						isInteractinve ? 'scale-y-100 px-4 py-2 ' : 'scale-y-0 max-h-0 p-0',
					)}
				>
					<Controller
						control={control}
						name="date"
						render={({ field }) => {
							return (
								<DatePicker
									name={field.name}
									value={field.value}
									onChange={(event) => field.onChange(event.target.value)}
									triggerClassName="w-[160px]"
								/>
							)
						}}
					/>
				</motion.div>
				<div className="relative">
					<input
						{...titleRegister}
						placeholder="Type note title here"
						type="text"
						className="flex font-semibold h-12 w-full rounded-lg border-none bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-none  disabled:cursor-not-allowed disabled:opacity-60"
						onFocus={() => setIsOpen(true)}
						onBlur={(event) => {
							titleRegister.onBlur(event)
						}}
					/>
				</div>
				{isInteractinve && (
					<textarea
						{...register('content', { maxLength: 280 })}
						placeholder="Place aditional content, if neccesary"
						className="w-full h-full bg-background px-3 focus:ring-0 focus:outline-none"
						rows={5}
					/>
				)}
				{isInteractinve && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
					>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="bg-foreground/5 p-2 flex justify-between items-center rounded-b"
						>
							<div
								data-error={Boolean(dateController.fieldState.error?.message)}
								className="pl-2 flex h-full gap-2 items-center data-[error=true]:text-destructive duration-500"
							>
								<Controller
									control={control}
									name="tags"
									render={({ field }) => {
										return (
											<InputTags
												suggestions={suggestions.map((item) => ({ text: item, id: item }))}
												value={field.value}
												onChange={(tags) => field.onChange(tags)}
											/>
										)
									}}
								/>
							</div>

							<div className="flex gap-2 items-center">
								<Button
									disabled={formState.isSubmitting}
									onClick={() => {
										if (onCancel) onCancel()
										reset({ title: '' })
										setIsOpen(false)
									}}
									type="button"
									variant="ghost"
									size="sm"
								>
									Cancel
								</Button>
								<Button size="sm" disabled={formState.isSubmitting}>
									{formState.isSubmitting && <Loader2 className="animate-spin" />}
									{initialValues?._id ? 'Update' : 'Create'}
								</Button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</fieldset>
		</form>
	)
}
