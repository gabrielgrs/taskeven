'use client'

import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { login } from '~/actions/auth'
import { emailPattern } from '~/utils/validation'
import Column from '../shared/Column'
import Description from '../shared/Description'
import Grid from '../shared/Grid'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export default function AuthUI() {
  const { register, handleSubmit, formState } = useForm({ defaultValues: { email: '' } })

  const onSubmit = async ({ email }: { email: string }) => {
    try {
      await login(email)
      toast.success('Check your email or spam for login link!')
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-[15vw] md:mt-0 md:h-screen w-full flex justify-center items-center mx-auto max-w-sm"
    >
      <Grid>
        <Column size={12}>
          <Link href="/" className="flex items-center gap-2 text-foreground/40 hover:text-foreground/90 duration-500">
            <ChevronLeft size={20} />
            Back to home
          </Link>
        </Column>
        <Column size={12}>
          <h1>Welcome back! 👋</h1>
          <Description>Enter your email to receive an email</Description>
        </Column>
        <Column size={12}>
          <Label>Email</Label>
          <Input
            {...register('email', { required: true, pattern: emailPattern })}
            disabled={formState.isSubmitting}
            placeholder="johndoe@email.com"
          />
        </Column>
        <Column size={12}>
          <Button className="w-full" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? <Loader2 className="animate-spin" /> : <span>Login with email</span>}
          </Button>
        </Column>

        <Column size={12} className="opacity-70 text-sm text-center px-2">
          By clicking continue, you agree to our{' '}
          <Link href="/terms-of-service" className="underline hover:opacity-80 duration-500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="underline hover:opacity-80 duration-500">
            Privacy Policy
          </Link>
          .
        </Column>
      </Grid>
    </form>
  )
}
