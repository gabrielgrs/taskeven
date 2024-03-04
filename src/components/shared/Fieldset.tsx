import { ReactNode } from 'react'
import { cn } from '~/utils/shadcn'
import { Label } from '../ui/label'

type FieldsetProps = {
  children: ReactNode
  label?: string
  error?: string
  info?: string
  className?: string
}

function Fieldset({ children, label, error, info, className }: FieldsetProps) {
  return (
    <fieldset className={cn('relative', className)}>
      {label && <Label>{label}</Label>}
      <div className="relative">{children}</div>
      <p
        role="alert"
        data-show={Boolean(error || info)}
        data-danger={Boolean(error)}
        className={
          'text-sm opacity-60 overflow-hidden pl-2 pt-1 transition-all duration-500 data-[show=false]:max-h-0 data-[show=true]:max-h-14 data-[danger=true]:text-red-400'
        }
      >
        {error || info}
      </p>
    </fieldset>
  )
}

export default Fieldset
