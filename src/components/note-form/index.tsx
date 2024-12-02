'use client'

// import { Combobox } from '@/components/combobox'
import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useController, useForm, useWatch } from 'react-hook-form'

type NoteSchema = {
	_id: string
	title: string
	content: string
	tags: Tag[]
	date: Date | undefined
}

type FormNote = Pick<NoteSchema, 'title' | 'content' | 'date'> & { tags: string[] }

type Props = {
	onCancel?: () => void
	onSubmit: (values: FormNote & { tags: string[] }) => void
	initialValues?: Partial<NoteSchema>
	tagOptions: Tag[]
	forceOpen?: boolean
}

const defaultValues: FormNote = {
	title: '',
	content: '',
	tags: [],
	date: undefined,
}

// function getInitialValues(initialValues: FormNote = {}) {
// 	const defaultValues: FormNote = { title: '', date: undefined, tags: [], content: '' }
// 	return { ...defaultValues, ...initialValues }
// }

export function NoteForm({ onSubmit: onSubmitFromParent, initialValues, onCancel, forceOpen = false }: Props) {
	const [isOpen, setIsOpen] = useState(forceOpen)
	const { handleSubmit, register, control, reset, formState } = useForm({
		mode: 'all',
		defaultValues,
	})

	const taskValue = useWatch({ name: 'title', control })
	// const dateValue = useWatch({ name: 'date', control })

	const onSubmit = async (values: typeof defaultValues) => {
		await onSubmitFromParent(values)
		reset({ title: '', date: undefined })
		setIsOpen(false)
		if (onCancel) onCancel()
	}

	const titleRegister = register('title', {
		required: 'Required field',
		// minLength: minLength(1),
		// maxLength: maxLength(32),
	})
	const dateController = useController({
		name: 'date',
		control,
		rules: { required: 'Required field' },
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
						className="w-full h-full bg-background px-3"
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
								Tags
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
