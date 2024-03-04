'use client'

import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Slider } from '~/components/ui/slider'
import { getCreditsBonusToRecharge } from '~/utils/configurations'
import { cn } from '~/utils/shadcn'

type Props = {
  name: string
  className?: string
  loading: boolean
  onPressRechargeButton: () => void
  userExperience: number
}

export default function ProductCard({ name, className, loading, onPressRechargeButton, userExperience }: Props) {
  const [amount, setAmount] = useState(500)

  return (
    <div className="border-2 border-accent p-2">
      <div
        className={cn(
          'px-4 pb-4 pt-8 rounded flex flex-col gap-4 text-neutral-800 opacity-90 hover:opacity-100 duration-500',
          className,
        )}
      >
        <span className="text-lg opacity-90 font-semibold">{name}</span>
        <div>
          <span className="text-5xl font-mono">
            {(amount / 100).toLocaleString('en', { currency: 'USD', style: 'currency' })}
          </span>
        </div>
        <div>
          <Slider
            defaultValue={[amount]}
            min={500}
            max={10000}
            step={100}
            onValueChange={(value) => {
              setAmount(value[0])
            }}
          />
        </div>
        <p className="opacity-80">
          You will receive{' '}
          <strong>
            {amount} credits + {getCreditsBonusToRecharge(userExperience, amount)} bonus
          </strong>{' '}
          based on level
        </p>
        <div className="flex justify-end">
          <Button disabled={loading} onClick={() => onPressRechargeButton()} variant="link">
            {loading ? 'Redirecting to checkout...' : 'Go to recharge page'}
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ArrowRight size={16} className="group-hover:translate-x-1 duration-500" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
