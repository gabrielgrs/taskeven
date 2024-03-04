import * as React from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import formatStringByPattern from 'format-string-by-pattern'
import { cn } from '~/utils/shadcn'

const inputVariations = cva(
  'flex w-full rounded-md border file:bg-card file:shadow-lg file:cursor-pointer file:font-medium file:text-primary file:border-none border-input  px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      contrasted: {
        true: 'bg-card',
        false: 'bg-background',
      },
      size: {
        default: 'h-10',
        sm: 'h-9',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariations> {
  mask?: string
  onlyNumbers?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onChange, mask, onlyNumbers, size, contrasted = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariations({ size, className, contrasted }))}
        ref={ref}
        onChange={(event) => {
          if (!onChange) return
          if (onlyNumbers) event.target.value = event.target.value.replace(/[^\d]/g, '').replace(/[^0-9]+/g, '')
          if (mask) event.target.value = formatStringByPattern(mask, event.target.value)
          onChange(event)
        }}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
