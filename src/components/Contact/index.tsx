'use client'

import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { sendContactEmail } from '~/actions/email'
import Column from '~/components/shared/Column'
import Fieldset from '~/components/shared/Fieldset'
import Grid from '~/components/shared/Grid'
import { Button, buttonVariants } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import useAuth from '~/utils/hooks/useAuth'
import { emailPattern } from '~/utils/validation'
import Title from '../shared/Title'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

const types = ['Contact', 'Feedback', 'Bug report', 'Suggestion']

const defaultValues = {
  name: '',
  email: '',
  type: types[0],
  message: '',
}

export default function ContactModal({ children }: { children: ReactNode }) {
  const { handleSubmit, register, formState, setValue } = useForm({ mode: 'all', defaultValues })
  const { user } = useAuth()
  const { push } = useRouter()

  async function onSubmit(values: typeof defaultValues) {
    try {
      await sendContactEmail(values.name, user?.email || values.email, values.message)
      toast.success('Message sent')
      push('/')
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid>
            <Column size={12} className="text-center">
              <Title variant="emerald">Contact</Title>
              <p className="text-sm opacity-60">Share your feedback, feature requests, ideas, or bug reports with me</p>
            </Column>
            <Column size={12}>
              <Fieldset label="Name" error={formState.errors.name?.message}>
                <Input {...register('name')} placeholder="Type your name" disabled={formState.isSubmitting} />
              </Fieldset>
            </Column>

            <Column size={12}>
              <Fieldset label="Contact type">
                <Select onValueChange={(value) => setValue('type', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue defaultValue={types[0]} placeholder={types[0]} />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((contactType) => (
                      <SelectItem key={contactType} value={contactType}>
                        {contactType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Fieldset>
            </Column>

            {!user && (
              <Column size={12}>
                <Fieldset label="Email" error={formState.errors.email?.message}>
                  <Input
                    {...register('email', { required: true, pattern: emailPattern })}
                    placeholder="Type your email"
                    disabled={formState.isSubmitting}
                  />
                </Fieldset>
              </Column>
            )}

            <Column size={12}>
              <Fieldset label="Message" error={formState.errors.message?.message}>
                <Textarea
                  {...register('message', { required: true })}
                  placeholder="Type your message"
                  disabled={formState.isSubmitting}
                />
              </Fieldset>
            </Column>

            <Column size={12} className="justify-self-end flex items-center gap-2">
              <Link href="/" className={buttonVariants({ variant: 'ghost' })}>
                Cancel
              </Link>
              <Button disabled={formState.isSubmitting}>
                {formState.isSubmitting && <Loader2 className="animate-spin" />}
                Send
              </Button>
            </Column>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}
