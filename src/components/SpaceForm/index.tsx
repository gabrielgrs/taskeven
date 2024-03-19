'use client'

import { ReactNode, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createCheckout } from '~/actions/checkout'
import { StripePrice } from '~/actions/services/stripe'
import { insertSpace } from '~/actions/space'
import Column from '~/components/shared/Column'
import Grid from '~/components/shared/Grid'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { PLANS } from '~/utils/constants'
import { PlanName } from '~/utils/constants/types'
import { formatCurrency, formatToSlug } from '~/utils/formattars'
import { cn } from '~/utils/shadcn'
import { maxLength, minLength, requiredField } from '~/utils/validation'
import Fieldset from '../shared/Fieldset'

function Container({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0)' }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

type DefaultValues = {
  name: string
  slug: string
  priceId: string
}

const defaultValues: DefaultValues = {
  name: '',
  slug: '',
  priceId: '',
}

type Step = 'FORM' | 'PLAN' | 'FINISH'

type Props = {
  prices: StripePrice[]
}

export default function SpaceFormUI({ prices }: Props) {
  const [step, setStep] = useState<Step>('FORM')
  const { push } = useRouter()
  const { register, handleSubmit, setValue, control, formState, trigger } = useForm({ defaultValues })

  const slugRegister = register('slug', { required: requiredField, minLength: minLength(3), maxLength: maxLength(30) })
  const selectedPriceId = useWatch({ name: 'priceId', control })

  const onSubmit = async (values: DefaultValues) => {
    try {
      const createdSpace = await insertSpace(values.name, values.slug)
      const amount = prices.find((x) => x.id === values.priceId)?.unit_amount || 0

      if (amount === 0) {
        toast.success('Space created with success.')
        return push(`/space/${createdSpace.slug}`)
      }

      const url = await createCheckout(values.priceId, createdSpace._id)

      toast.success('Redirecting you to checkout page!')
      window.open(url)
    } catch {
      return toast.error('Something went wrong')
    }
  }

  const onChangeStep = async (stepName: Step) => {
    const isValid = await trigger()
    if (!isValid) return
    setStep(stepName)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-16">
      {(step === 'FORM' || step === 'PLAN') && (
        <Container>
          <Grid>
            <Column size={6}>
              <Fieldset label="Name" error={formState.errors.name?.message}>
                <Input
                  {...register('name', {
                    required: requiredField,
                    minLength: minLength(3),
                    maxLength: maxLength(24),
                  })}
                  placeholder="Type space name"
                />
              </Fieldset>
            </Column>

            <Column size={6}>
              <Fieldset label="Slug" error={formState.errors.slug?.message}>
                <Input
                  {...slugRegister}
                  onChange={(event) => {
                    event.target.value = formatToSlug(event.target.value)
                    slugRegister.onChange(event)
                  }}
                  placeholder="Type space slug"
                />
              </Fieldset>
            </Column>

            <Column size={12} className="flex justify-end">
              <Button type="button" variant="link" onClick={() => onChangeStep('PLAN')}>
                Advance
              </Button>
            </Column>
          </Grid>
        </Container>
      )}

      {step === 'PLAN' && (
        <Container>
          <Grid>
            {prices.map((price) => {
              const totalPrice = formatCurrency(price.unit_amount ?? 0)

              return (
                <Column size={6} key={price.id}>
                  <button
                    type="button"
                    onClick={() => setValue('priceId', price.id)}
                    className={cn(
                      'relative border-[1px] border-foreground/20 rounded-lg py-4 px-2 duration-500 w-full h-full',
                      selectedPriceId === price.id && 'border-primary/70',
                    )}
                  >
                    <span className="absolute flex justify-center items-center -bottom-2 px-2 rounded-full -right-4 bg-background text-primary border-primary/50 border-[1px]">
                      {price.nickname}
                    </span>
                    <div className="flex justify-between w-full">
                      <p>
                        {price.unit_amount === 0 ? (
                          <span className="font-thin font-mono text-primary text-4xl">{totalPrice}</span>
                        ) : (
                          Array.from(totalPrice).map((value, index) => (
                            <motion.span
                              key={value}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1, duration: 0.5 }}
                              className="font-thin font-mono text-primary text-4xl"
                            >
                              {value}
                            </motion.span>
                          ))
                        )}
                      </p>
                    </div>
                    <div className="px-2 pt-8 flex flex-col">
                      <ul className="flex flex-wrap text-sm gap-x-6 gap-y-2">
                        {PLANS[price.nickname as PlanName].features.map((feature) => (
                          <li key={feature} className="flex items-center group">
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </button>
                </Column>
              )
            })}
          </Grid>
        </Container>
      )}

      {selectedPriceId && (
        <Container>
          <Column size={12} className="flex justify-end">
            <Button disabled={formState.isSubmitting}>
              {prices.find((x) => x.id === selectedPriceId)?.unit_amount === 0 ? 'Create project' : 'Go to checkout'}
              {formState.isSubmitting && <Loader2 size={20} className="animate-spin" />}
            </Button>
          </Column>
        </Container>
      )}
    </form>
  )
}
