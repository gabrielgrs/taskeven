'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { login } from '~/actions/auth'
import { emailPattern } from '~/utils/validation'
import Column from '../shared/Column'
import Grid from '../shared/Grid'
import { Button } from '../ui/button'
import { Drawer, DrawerContent } from '../ui/drawer'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false)

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
    <Drawer open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
      <Button variant="link" onClick={() => setIsOpen(true)}>
        Login
      </Button>
      <DrawerContent>
        <form onSubmit={handleSubmit(onSubmit)} className="pt-8 px-4 mx-auto max-w-sm w-full flex justify-center">
          <Grid>
            <Column size={12}>
              <h1>Login</h1>
            </Column>
            <Column size={12}>
              <Label>Email</Label>
              <Input
                {...register('email', { required: true, pattern: emailPattern })}
                disabled={formState.isSubmitting}
                placeholder="johndoe@gmail.com"
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
      </DrawerContent>
    </Drawer>
  )
}
