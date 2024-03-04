'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import useAuth from '~/utils/hooks/useAuth'
import { Button } from '../ui/button'

export default function ContactButton() {
  const { isLoading } = useAuth()

  if (isLoading) return null

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="fixed bottom-1 right-1 opacity-70 backdrop-blur-sm hover:opacity-100 transition-opacity duration-500"
    >
      <MessageCircle size={20} />
      <motion.div
        initial={{ opacity: 0, translateY: '20px' }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 1 }}
      >
        Feedback
      </motion.div>
    </Button>
  )
}
