'use client'

import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { motion } from 'framer-motion'
import { CalendarClock, Loader2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { TaskSchema } from '~/lib/mongoose'
import { maxLenth, minLength, requiredField } from '~/utils/validation'

type Props = {
  onCancel?: () => void
  onSubmit: (values: Partial<TaskSchema>) => void
  initialValues?: Partial<TaskSchema>
}

const defaultValues: Partial<TaskSchema> = {
  title: '',
  date: undefined,
}

function getInitialValues(iinitialValues: Partial<TaskSchema> = {}) {
  const defaultValues: Partial<TaskSchema> = { title: '', date: undefined }
  return { ...defaultValues, ...iinitialValues }
}

export default function TaskForm({ onSubmit: onSubmitFromParent, initialValues, onCancel }: Props) {
  const [focused, setFocused] = useState(false)
  const { handleSubmit, register, control, reset, formState } = useForm({
    mode: 'all',
    defaultValues: getInitialValues(initialValues),
  })

  const taskValue = useWatch({ name: 'title', control })
  // const dateValue = useWatch({ name: 'date', control })

  const onSubmit = async (values: typeof defaultValues) => {
    await onSubmitFromParent(values)
    reset({ title: '' })
    setFocused(false)
    if (onCancel) onCancel()
  }

  const titleRegister = register('title', { required: requiredField, minLength: minLength(1), maxLength: maxLenth(40) })

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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-foreground/5 p-2 flex justify-between items-center rounded-b"
            >
              <div className="flex gap-2 items-center">
                <div className="flex gap-2 items-center">
                  <CalendarClock size={14} />
                  <button>Today</button>
                  <button>Tomorrow</button>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <Button
                  disabled={formState.isSubmitting}
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
