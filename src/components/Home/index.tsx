'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
// import WailtList from './Waitlist'

const AccentSpan = ({ children }: { children: ReactNode }) => {
  return <span className="bg-foreground/90 text-neutral-300 dark:text-neutral-700 px-1">{children}</span>
}

export default function HomeUI() {
  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <motion.h1
        initial={{ opacity: 1, height: 'auto' }}
        animate={{ opacity: 0, height: 0, translateY: '-100px' }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-[100px] text-center"
      >
        Hello.
      </motion.h1>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 2 }}
        className="text-4xl px-[5vw] md:text-5xl text-center leading-[55px] md:leading-[80px] text-foreground/90"
      >
        Unlock the power of <AccentSpan>collaboration</AccentSpan>
        <br />
        <AccentSpan>focus on</AccentSpan> <span> what is essential.</span>
      </motion.h1>
    </div>
  )
}
