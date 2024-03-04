'use client'

import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { format, isValid } from 'date-fns'
import { motion } from 'framer-motion'
import { CalendarClock, Loader2, Wand2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { TaskSchema } from '~/lib/mongoose'
import { MAX_ANNOTATION_LENGTH } from '~/utils/configurations'
import { maxLenth, minLength, requiredField } from '~/utils/validation'

type Props = {
  onCancel?: () => void
  onSubmit: (values: Partial<TaskSchema>) => void
  initialValues?: Partial<TaskSchema>
  onGenerateAnnotationSuggestion: () => Promise<string | undefined>
}

const defaultValues: Partial<TaskSchema> = {
  title: '',
  annotations: '',
  reminderDate: undefined,
}

function getInitialValues(iinitialValues: Partial<TaskSchema> = {}) {
  const defaultValues: Partial<TaskSchema> = { title: '', annotations: '', reminderDate: undefined }
  return { ...defaultValues, ...iinitialValues }
}

const getReminderValue = (reminderDateValue: Date | undefined, initialReminderdate: Date | undefined) => {
  const value = reminderDateValue || initialReminderdate
  if (value && isValid(new Date(value))) return format(new Date(value), 'MM/dd/yyyy')
  return 'Set reminder'
}

export default function TaskForm({
  onSubmit: onSubmitFromParent,
  initialValues,
  onCancel,
  onGenerateAnnotationSuggestion,
}: Props) {
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false)
  const [isSelectingDate, setIsSelectingDate] = useState(false)
  const [focused, setFocused] = useState(false)
  const { handleSubmit, register, control, reset, formState, setValue } = useForm({
    mode: 'all',
    defaultValues: getInitialValues(initialValues),
  })

  const taskValue = useWatch({ name: 'title', control })
  const annotationsValue = useWatch({ name: 'annotations', control })
  const reminderDateValue = useWatch({ name: 'reminderDate', control })

  const onSubmit = async (values: typeof defaultValues) => {
    await onSubmitFromParent(values)
    reset({ title: '' })
    setFocused(false)
    if (onCancel) onCancel()
  }

  const onGenerateSuggestion = async () => {
    setIsGeneratingSuggestion(true)
    const suggestion = await onGenerateAnnotationSuggestion()
    setValue('annotations', suggestion)
    setIsGeneratingSuggestion(false)
  }

  const titleRegister = register('title', { required: requiredField, minLength: minLength(1), maxLength: maxLenth(40) })
  const annotationsRegister = register('annotations', { maxLength: maxLenth(MAX_ANNOTATION_LENGTH) })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset
        data-focus={focused}
        className="border-2 border-primary/10 data-[focus=true]:border-primary/70 duration-500 rounded-lg "
      >
        <div className="relative">
          <input
            {...titleRegister}
            placeholder="What you need to do?"
            type="text"
            className="flex h-12 w-full rounded-lg border-none bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-none  disabled:cursor-not-allowed disabled:opacity-60"
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
              titleRegister.onBlur(event)
              setFocused(false)
            }}
          />
        </div>
        {taskValue && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <textarea
                {...annotationsRegister}
                className="flex text-foreground/90 pr-8 w-full rounded-md border-none border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-none  disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Add some annotation"
                rows={4}
                onFocus={() => setFocused(true)}
                onBlur={(event) => {
                  annotationsRegister.onBlur(event)
                  setFocused(false)
                }}
              />
              <span className="absolute top-0 right-1 px-1 opacity-50 text-sm">
                {annotationsValue?.length || 0}/{MAX_ANNOTATION_LENGTH}
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-foreground/5 p-2 flex justify-between items-center rounded-b"
            >
              <div className="flex gap-2 items-center">
                <div className="flex gap-2 items-center">
                  <Popover open={isSelectingDate} onOpenChange={(state) => setIsSelectingDate(state)}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        disabled={isGeneratingSuggestion || formState.isSubmitting}
                        variant="ghost"
                        size="icon"
                        className="flex gap-1 items-center opacity-60 hover:opacity-70 duration-500 text-xs"
                        onClick={() => setIsSelectingDate(true)}
                      >
                        <CalendarClock size={14} />
                        <span>{getReminderValue(reminderDateValue, initialValues?.reminderDate)}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(initialValues?.reminderDate!)}
                        onSelect={(date) => {
                          setValue('reminderDate', date)
                          setIsSelectingDate(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  type="button"
                  disabled={isGeneratingSuggestion || formState.isSubmitting}
                  variant="ghost"
                  size="icon"
                  className="flex gap-1 items-center opacity-60 hover:opacity-70 duration-500 text-xs"
                  onClick={() => onGenerateSuggestion()}
                >
                  {isGeneratingSuggestion ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <>
                      <Wand2 size={12} />
                      <span className="hidden sm:block">Generate annotation with AI</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex gap-2 items-center">
                <Button
                  disabled={formState.isSubmitting || isGeneratingSuggestion}
                  onClick={() => {
                    if (onCancel) onCancel()
                    reset({ title: '' })
                    setFocused(false)
                  }}
                  type="button"
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button size="sm" disabled={formState.isSubmitting || isGeneratingSuggestion}>
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
