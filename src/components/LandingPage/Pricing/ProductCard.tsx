'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Slider } from '~/components/ui/slider'
import { cn } from '~/utils/shadcn'

type Props = {
  name: string
  className?: string
}

export default function ProductCard({ name, className }: Props) {
  const [amount, setAmount] = useState(500)

  return (
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
        You will receive <strong>{amount} credits + bonus</strong> per each level you are!
      </p>
      <Link href="/app" className="mt-8 flex justify-end items-center gap-1 group">
        Get started
        <ArrowRight size={16} className="group-hover:translate-x-1 duration-500" />
      </Link>
    </div>
  )
}
