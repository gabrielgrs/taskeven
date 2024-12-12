'use client'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/libs/utils'
import dayjs from 'dayjs'
import { X } from 'lucide-react'
import { Input } from '../ui/input'

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
						dayjs(new Date(selectedDate)).format('MM/DD/YYYY HH:mm')
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
				{/* <div className="flex items-center justify-between space-x-2 p-3">
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
				</div> */}
				<Calendar
					month={selectedDate || new Date()}
					mode="single"
					selected={selectedDate}
					onSelect={(newDate) => {
						// setOpen(false)
						onChange({ target: { name, value: newDate } })
					}}
					onMonthChange={(newMonth) => {
						return onChange({ target: { name, value: new Date(newMonth) } })
					}}
					initialFocus
				/>
				<div className="p-2 flex justify-between gap-1">
					<Input
						placeholder="hh:mm"
						type="time"
						className="w-[160px]"
						onChange={(event) => {
							const [hours, minutes] = event.target.value.split(':')
							const date = dayjs(selectedDate || new Date())
								.startOf('day')
								.add(Number(hours), 'hours')
								.add(Number(minutes), 'minutes')
							// date.setHours(parseInt(hours, 10))
							// date.setMinutes(parseInt(minutes, 10))

							onChange({ target: { name, value: date.toDate() } })
						}}
					/>
				</div>
			</PopoverContent>
		</Popover>
	)
}
