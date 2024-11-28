'use client'

// import { Combobox } from '@/components/combobox'
import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useController, useFieldArray, useForm, useWatch } from 'react-hook-form'
import type { Tag } from '../types'
import { Editor } from './editor'

type NoteSchema = {
	_id: string
	title: string
	content: string
	tags: Tag[]
	date: Date | undefined
}

type Props = {
	onCancel?: () => void
	onSubmit: (values: Partial<NoteSchema>) => void
	initialValues?: Partial<NoteSchema>
	tagOptions: Tag[]
	forceOpen?: boolean
}

const defaultValues: Partial<NoteSchema> = {
	title: '',
	content: '',
	tags: [],
	date: undefined,
}

function getInitialValues(initialValues: Partial<NoteSchema> = {}) {
	const defaultValues: Partial<NoteSchema> = { title: '', date: undefined }
	return { ...defaultValues, ...initialValues }
}

export function NoteForm({ onSubmit: onSubmitFromParent, initialValues, onCancel, forceOpen = false }: Props) {
	const [isOpen, setIsOpen] = useState(forceOpen)
	const { handleSubmit, register, control, reset, formState } = useForm({
		mode: 'all',
		defaultValues: getInitialValues(initialValues),
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
	const tagsFieldArray = useFieldArray({ control, name: 'tags' })

	const isInteractinve = isOpen || Boolean(taskValue || contentValue)

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<fieldset
				data-focus={isOpen}
				className="border-2 border-primary/10 data-[focus=true]:border-primary/70 duration-500 rounded-lg bg-background"
			>
				<div className="relative">
					<input
						{...titleRegister}
						placeholder="Type note title here"
						type="text"
						className="flex h-12 w-full rounded-lg border-none bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-none  disabled:cursor-not-allowed disabled:opacity-60"
						onFocus={() => setIsOpen(true)}
						onBlur={(event) => {
							titleRegister.onBlur(event)
						}}
					/>
				</div>
				{isInteractinve && (
					<motion.div
						initial={{ padding: 0, scale: 0 }}
						animate={{ padding: '4px 8px', scale: 1 }}
						exit={{ padding: 0, scale: 0 }}
						className={cn('duration-500', isInteractinve ? 'scale-100 p-2' : 'scale-0 p-0')}
					>
						<Controller
							control={control}
							name="content"
							render={({ field }) => {
								return (
									<Editor
										value={field.value ?? ''}
										onChange={(value) => field.onChange(value)}
										onFocus={() => setIsOpen(true)}
									/>
								)
							}}
						/>
					</motion.div>
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
								{/* <Controller
									control={control}
									name="tags"
									render={() => <Combobox options={tagOptions.map((tag) => ({ value: tag._id, label: tag.name }))} />}
								/> */}
								{/* {tagsFieldArray.fields.map((field, index) => {
									return (
										<Combobox
											key={field.id}
											options={tagOptions.map((tag) => ({
												value: tag._id,
												label: tag.name,
											}))}
											value={field._id}
											onChange={(value) => {
												tagsFieldArray.remove(index)
												tagsFieldArray.append({ _id: value })
											}}
										/>
									)
								})} */}
								<button
									type="button"
									onClick={() =>
										tagsFieldArray.append({
											_id: '',
											backgroundColor: '',
											name: '',
										})
									}
								>
									Add
								</button>
								{/* <button
									data-active={isSameDay(new Date(), new Date(dateController.field.value!))}
									type="button"
									className="text-sm opacity-50 data-[active=true]:opacity-100 duration-500"
									onClick={() => dateController.field.onChange(new Date())}
								>
									Today
								</button> */}
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
