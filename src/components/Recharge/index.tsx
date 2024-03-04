'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createCheckout } from '~/actions/checkout'
import Column from '~/components/shared/Column'
import Grid from '~/components/shared/Grid'
import Title from '~/components/shared/Title'
import useAuth from '~/utils/hooks/useAuth'
import ProductCard from './ProductCard'

type Product = {
  priceId: string
  productName: string
}

type TemplateProps = {
  products: Product[]
}

export default function RechargeUI({ products }: TemplateProps) {
  const [redirectingId, setRedirectingId] = useState('')
  const { user } = useAuth()

  const onRecharge = async (priceId: string) => {
    try {
      setRedirectingId(priceId)

      const { url } = await createCheckout(priceId)
      if (!url) throw Error('URL is required')

      toast.success('We are redirecting you to checkout')

      setTimeout(() => {
        window.location.href = url
      }, 1000)
    } catch (error) {
      setRedirectingId('')
      toast.error('Failed to recharge')
    }
  }

  return (
    <main>
      <Grid>
        <Column size={12}>
          <Title className="text-center">Recharge</Title>
        </Column>
        <Column size={12}>
          {products.map((product) => {
            return (
              <ProductCard
                key={product.priceId}
                name={product.productName}
                loading={redirectingId === product.priceId}
                onPressRechargeButton={() => onRecharge(product.priceId)}
                userExperience={user!.experience}
              />
            )
          })}
        </Column>
        <Column size={12}>
          <p className="text-center text-foreground/50">
            Level up, bonus up! <br />
            Conquer each level using <span className="text-primary">Taskeven</span> and claim your +1% upgrade!
          </p>
        </Column>
      </Grid>
    </main>
  )
}
