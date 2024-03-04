'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
// import WailtList from './Waitlist'

const AccentSpan = ({ children }: { children: ReactNode }) => {
  return <span className="bg-foreground/90 text-neutral-300 dark:text-neutral-700 px-1">{children}</span>
}

export default function Heading() {
  return (
    <>
      <motion.h1
        initial={{ opacity: 1, height: 'auto' }}
        animate={{ opacity: 0, height: 0, translateY: '-100px' }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-[100px]"
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
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 2 }}
        className="pt-4 mx-auto max-w-xl text-center text-foreground/50 text-base md:text-lg"
      >
        Join to the productivity revolution! Share lists, set vibrant reminders, jot lively notes, and let AI fuel your
        journey to greatness!
      </motion.p>

      {/* <WailtList /> */}

      <Link
        href="#about"
        className="absolute bottom-0 left-[50%] -translate-x-[50%] flex gap-2 items-center opacity-50 hover:opacity-100 duration-500"
      >
        <span className="text-base">Know more</span>
        <ChevronDown size={14} className="animate-bounce" />
      </Link>
    </>
  )
}
