'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '~/utils/shadcn'
import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

type Event = {
  target: {
    value: Date | undefined
    name: string
  }
}

type DatePickerProps = {
  value: Date | undefined
  onChange: (event: Event) => void
  name: string
  className?: string
}

export default function DatePicker({ value, onChange, name, className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={
            (cn('w-[280px] justify-start text-left font-normal', !value && 'text-muted-foreground'), className)
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'MM/dd/yyyy') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => onChange({ target: { name, value: date } })}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
