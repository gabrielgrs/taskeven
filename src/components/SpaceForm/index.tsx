'use client'

import { useForm, useWatch } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createCheckout } from '~/actions/checkout'
import { StripePrice } from '~/actions/services/stripe'
import { insertSpace } from '~/actions/space'
import Column from '~/components/shared/Column'
import Grid from '~/components/shared/Grid'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { formatCurrency, formatToSlug } from '~/utils/formattars'
import { cn } from '~/utils/shadcn'
import { maxLength, minLength, requiredField } from '~/utils/validation'
import Fieldset from '../shared/Fieldset'

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

type Props = {
  prices: StripePrice[]
}

export default function SpaceFormUI({ prices }: Props) {
  const { push } = useRouter()
  const { register, handleSubmit, setValue, control, formState } = useForm({ defaultValues })

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <Column size={12}>
          <h1>Create space</h1>
        </Column>
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

        {prices.map((price) => {
          const totalPrice = formatCurrency(price.unit_amount ?? 0)

          return (
            <Column size={12} key={price.id}>
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
                  <p className="font-thin font-mono text-primary text-4xl">{totalPrice}</p>
                </div>
              </button>
            </Column>
          )
        })}

        {selectedPriceId && (
          <Column size={12} className="flex justify-end">
            <Button disabled={formState.isSubmitting}>Go to checkout</Button>
          </Column>
        )}
      </Grid>
    </form>
  )
}
