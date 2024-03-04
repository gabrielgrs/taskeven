'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Flame, Loader2, Rocket } from 'lucide-react'
import { toast } from 'sonner'
import { getWaitlistSize, joinList } from '~/actions/waitList'
import Column from '~/components/shared/Column'
import Fieldset from '~/components/shared/Fieldset'
import Grid from '~/components/shared/Grid'
import Title from '~/components/shared/Title'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { MIN_WAITLIST_TO_BE_DISPLAYED } from '~/utils/configurations'
import { emailPattern } from '~/utils/validation'

export default function WailtList() {
  const [size, setSize] = useState(0)
  const { handleSubmit, formState, register } = useForm({ mode: 'all', defaultValues: { email: '' } })

  useEffect(() => {
    getWaitlistSize().then(setSize)
  }, [])

  const onSubmit = async (values: { email: string }) => {
    await joinList(values.email)
    toast.success('Joined the waitlist')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          key={size}
          className="py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
        >
          <button className="bg-primary-foreground text-secondary py-2 px-4 rounded-lg flex items-center gap-1 group">
            <span className="group-hover:animate-pulse flex items-center gap-2">
              {size >= MIN_WAITLIST_TO_BE_DISPLAYED ? `Join together other ${size} people` : 'Join waitlist'}
              <Flame size={18} className="group-hover:text-destructive group-hover:scale-110 duration-500" />
            </span>
          </button>
        </motion.div>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid>
            <Column size={12}>
              <Title variant="primary">Join our wailitst</Title>
            </Column>

            <Column size={12}>
              <Fieldset label="Email" error={formState.errors.email?.message}>
                <Input
                  {...register('email', { required: true, pattern: emailPattern })}
                  placeholder="Type your email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={formState.isSubmitting}
                />
              </Fieldset>
            </Column>

            <Column size={12} className="flex justify-end gap-2">
              <Button disabled={formState.isSubmitting}>
                {formState.isSubmitting && <Loader2 className="animate-spin opacity-60" size={16} />}
                Join <Rocket size={16} />
              </Button>
            </Column>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}
