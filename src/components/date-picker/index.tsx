'use client'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/libs/utils'
import dayjs from 'dayjs'
import { X } from 'lucide-react'

type Event = {
	target: {
		name: string
		value: Date | undefined
	}
}

type Props = {
	value: Date | undefined
	onChange: (event: Event) => void
	name: string
	placeholder?: string
	triggerClassName?: string
}

export function DatePicker({ name, value: selectedDate, onChange, placeholder = 'Select', triggerClassName }: Props) {
	const [open, setOpen] = useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-full justify-start text-left font-normal bg-background hover:bg-secondary',
						!dayjs(selectedDate).isValid() && 'text-muted-foreground',
						triggerClassName,
						open && 'ring-2 ring-ring ring-offset-2',
					)}
				>
					{selectedDate ? (
						dayjs(new Date(selectedDate)).format('MM/DD/YYYY')
					) : (
						<span className="text-muted-foreground">{placeholder}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<div className="flex justify-end">
					<button className="p-2" type="button" onClick={() => setOpen(false)}>
						<X size={20} className="text-muted-foreground" />
					</button>
				</div>
				<Calendar
					month={selectedDate || new Date()}
					mode="single"
					selected={selectedDate}
					onSelect={(newDate) => {
						setOpen(false)
						onChange({ target: { name, value: newDate } })
					}}
					onMonthChange={(newMonth) => {
						return onChange({ target: { name, value: new Date(newMonth) } })
					}}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	)
}
