'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, Loader2, User } from 'lucide-react'
import { toast } from 'sonner'
import { login, validateVerificationCode } from '~/actions/auth'
import Column from '~/components/shared/Column'
import Description from '~/components/shared/Description'
import Fieldset from '~/components/shared/Fieldset'
import Grid from '~/components/shared/Grid'
import { Button, buttonVariants } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { isFeatureEnabled } from '~/utils/configurations'
import { emailPattern, requiredField } from '~/utils/validation'

const defaultValues = {
  email: '',
  verificationCode: '',
}

export default function AuthUI({ isAuthenticated = false }) {
  const { handleSubmit, register, formState, getValues } = useForm({ mode: 'all', defaultValues })
  const [showVerificationCode, setShowVerificationCode] = useState(false)
  const [isRedirecting, setIsRedirecinting] = useState(false)
  const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/app'
    }
  }, [isAuthenticated])

  async function onSubmit(values: typeof defaultValues) {
    try {
      if (values.verificationCode) {
        const { token } = await validateVerificationCode(values.verificationCode)
        setIsRedirecinting(true)
        toast.success('Validating your account')

        return setTimeout(() => {
          window.location.href = `/auth?token=${token}`
        }, 3000)
      }

      await login(values.email)
      setLoginAttempts((p) => p + 1)
      setShowVerificationCode(true)
      return toast.success('Check your email')
    } catch {
      setIsRedirecinting(false)
      return toast.error('Something went wrong')
    }
  }

  const onResendVerificationEmail = async (email: string) => {
    try {
      await login(email)
      setLoginAttempts((p) => p + 1)
      return toast.success('Check your email or spam.')
    } catch {
      setIsRedirecinting(false)
      return toast.error('Something went wrong')
    }
  }

  const onGoogleSignIn = async () => {
    try {
      setIsGoogleRedirecting(true)
      return signIn('google', { callbackUrl: '/auth' })
    } catch {
      setIsGoogleRedirecting(false)
      toast.error('Something went wrong')
    }
  }

  if (isAuthenticated) return <Loader2 className="m-2 text-primary animate-spin" />

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 mt-16 md:mt-0 mx-auto max-w-4xl">
      <Link href="/" className={buttonVariants({ variant: 'ghost', className: 'absolute left-2 top-2  group gap-1' })}>
        <ChevronLeft
          size={16}
          className="group-hover:-translate-x-1 duration-500 opacity-60 hover:text-primary-foreground"
        />
        <span>Back to home</span>
      </Link>
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-center max-w-xs">
          Welcome to <span className="text-primary font-semibold">Taskeven</span>! 👋
        </h1>
        <Description className="text-center">We are under beta test</Description>
      </div>
      <main className="mx-auto max-w-sm flex w-full items-start md:items-center min-h-screen">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full bg-card shadow border-[1px] border-foreground/5 py-12 px-8 rounded-lg"
        >
          <Grid>
            {showVerificationCode ? (
              <>
                <Column size={12}>
                  <Fieldset label="Veritification Code" error={formState.errors.verificationCode?.message}>
                    <Input
                      {...register('verificationCode', { required: requiredField })}
                      placeholder="Type your verification code"
                      disabled={formState.isSubmitting}
                    />
                  </Fieldset>
                  <motion.div
                    key={loginAttempts}
                    className="flex justify-end"
                    initial={{ opacity: 0, height: '0' }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.5, delay: 30 }}
                  >
                    <Button
                      variant="link"
                      type="button"
                      className="text-xs text-foregorund/5 py-0 h-max opacity-50"
                      onClick={() => onResendVerificationEmail(getValues('email'))}
                    >
                      Click here to resend.
                    </Button>
                  </motion.div>
                </Column>
              </>
            ) : (
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
            )}

            <Column size={12}>
              <Button disabled={formState.isSubmitting || isRedirecting || isGoogleRedirecting} className="w-full">
                {(formState.isSubmitting || isRedirecting) && <Loader2 className="animate-spin" />}
                {formState.isSubmitSuccessful ? 'Login' : 'Sign In with email'}
              </Button>
            </Column>

            {isFeatureEnabled('GOOGLE_AUTH') && (
              <>
                <Column size={12}>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                </Column>

                <Column size={12}>
                  <Button
                    onClick={() => onGoogleSignIn()}
                    variant="outline"
                    type="button"
                    disabled={isGoogleRedirecting || isRedirecting}
                    className="w-full"
                  >
                    {isGoogleRedirecting ? <Loader2 className="animate-spin" /> : <User />} Sign In with Google
                  </Button>
                </Column>
              </>
            )}

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
      </main>
    </div>
  )
}
