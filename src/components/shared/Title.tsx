import { ReactNode } from 'react'
import { cn } from '~/utils/shadcn'

const variants = {
  primary: 'from-primary to-primary/80',
  secondary: 'from-secondary to-secondary/80',
  accent: 'from-accent to-accent/80',
  pink: 'from-pink-600 to-pink-300',
  emerald: 'from-emerald-600 to-emerald-300',
  indigo: 'from-indigo-600 to-indigo-300',
  blue: 'from-blue-600 to-blue-300',
  green: 'from-green-600 to-green-300',
  teal: 'from-teal-600 to-teal-300',
  orange: 'from-orange-600 to-orange-300',
  red: 'from-red-600 to-red-300',
}

type Props = {
  children: ReactNode
  className?: string
  variant?: keyof typeof variants
}

export default function Title({ children, className, variant = 'primary' }: Props) {
  return (
    <h1
      className={cn(
        'leading-[3rem] pb-1 text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r',
        variants[variant],
        className,
      )}
    >
      {children}
    </h1>
  )
}
