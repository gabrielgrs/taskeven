'use client'

import { ReactNode, useState } from 'react'
import { motion } from 'framer-motion'
import { StripePrice } from '~/actions/services/stripe'
import Column from '~/components/shared/Column'
import { Button } from '~/components/ui/button'
import SpaceFormUI from '../SpaceForm'

function BlurDiv({ children, blurred }: { children: ReactNode; blurred: boolean }) {
  if (blurred) return null

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

export default function OnboardingUI({ prices }: { prices: StripePrice[] }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="flex flex-col gap-16">
      <BlurDiv blurred={false}>
        <Column size={12} className="text-secondary text-lg">
          <p>
            Hello there! 🚀 Ready to turbocharge your productivity? Dive into our platform for seamless task and note
            organization! Upgrade for next-level features and sail smoothly through your day! ⚡ Let{"'"}s set sail,
            matey! 🌊
          </p>
        </Column>

        <Column size={12} className="flex justify-end">
          <Button variant="link" onClick={() => setShowForm(true)}>
            Advance
          </Button>
        </Column>
      </BlurDiv>

      {showForm && <SpaceFormUI prices={prices} />}
    </div>
  )
}
