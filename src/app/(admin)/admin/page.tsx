'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createProduct, disableAllPrices, getPrices } from '~/actions/services/stripe'
import { PLANS } from '~/utils/constants'

type Acc = {
  name: string
  amount: number
}

export default function AdminHome() {
  const [data, setData] = useState<any>()
  const [loading, setLoading] = useState(false)

  const onGetPrices = async () => {
    try {
      setLoading(true)
      const response = await getPrices()
      setData(response)
      toast.success('Finished')
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const onRecreatePrices = async () => {
    try {
      setLoading(true)

      await disableAllPrices()
      const allPlans = Object.entries(PLANS).reduce((acc: Acc[], [name, plan]) => {
        acc.push({ name, amount: plan.price })
        return acc
      }, [])
      const response = await Promise.all(allPlans.map((plan) => createProduct(plan.name, plan.amount)))
      setData(response)
      toast.success('Finished')
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader2 className="w-4 h-4 animate-spin" />

  return (
    <div className="flex flex-col gap-8">
      <h1>Admin home</h1>
      <div className="flex gap-4 items-center">
        <button onClick={onRecreatePrices}>Recreate prices</button>
        <button onClick={onGetPrices}>Get Prices</button>
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
