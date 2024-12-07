'use client'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/libs/utils'
import { getMonthsOfYear } from '@/utils/date/months'
import dayjs from 'dayjs'

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i)

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
						'w-full justify-start text-left font-normal bg-background',
						!dayjs(selectedDate).isValid() && 'text-muted-foreground',
						triggerClassName,
						open && 'ring-2 ring-ring ring-offset-2',
					)}
				>
					{selectedDate ? dayjs(new Date(selectedDate)).format('MM/DD/YYYY') : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<div className="flex items-center justify-between space-x-2 p-3">
					<Select
						value={selectedDate ? new Date(selectedDate).getMonth().toString() : undefined}
						onValueChange={(monthIndex) => {
							const date = new Date(selectedDate || new Date())

							onChange({
								target: {
									name,
									value: dayjs(date).add(Number(monthIndex), 'month').toDate(),
								},
							})
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Month" />
						</SelectTrigger>
						<SelectContent>
							{getMonthsOfYear().map((month, index) => (
								<SelectItem key={month} value={index.toString()}>
									{month}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={selectedDate ? new Date(selectedDate).getFullYear().toString() : undefined}
						onValueChange={(value) => {
							onChange({ target: { name, value: new Date(value) } })
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Year" />
						</SelectTrigger>
						<SelectContent>
							{years.map((year) => (
								<SelectItem key={year} value={year.toString()}>
									{year}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
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
