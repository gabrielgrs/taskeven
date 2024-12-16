'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/libs/utils'
import { ComponentProps, forwardRef, useState } from 'react'

type Option = {
	label: string
	value: string
}

type Props = ComponentProps<'input'> & {
	options: Option[]
	onChange: (value: string) => void
	mask?: string
	onlyNumbers?: boolean
}

export const InputDropdown = forwardRef<HTMLInputElement, Props>(
	({ name, value = '', onChange, className, options, placeholder, mask, onlyNumbers }, ref) => {
		const [open, setOpen] = useState(false)

		const filteredOptions = options.filter((x) => {
			const optionLabel = x.label.toLowerCase()
			const optionValue = x.value.toLowerCase()
			const searchValue = value.toString().toLowerCase()
			return optionLabel.includes(searchValue) || optionValue.includes(searchValue)
		})

		return (
			<div className={cn('relative', className)}>
				<Input
					ref={ref}
					onlyNumbers={onlyNumbers}
					onFocus={() => setOpen(true)}
					onBlur={() => setTimeout(() => setOpen(false), 150)}
					name={name}
					value={value.toString()}
					mask={mask}
					onChange={(event) => onChange?.(event.target.value.trim().replace(/ /g, ''))}
					placeholder={placeholder}
				/>

				<div
					className={cn(
						'absolute top-[100%] left-0 w-full z-10 bg-background border mt-2 rounded-lg duration-500 z-20',
						open ? 'h-auto max-h-40 p-1 opacity-100 overflow-y-auto' : 'h-0 p-0 pointer-events-none opacity-0',
					)}
				>
					{open
						? filteredOptions.map((op) => (
								<button
									type="button"
									key={op.value}
									onClick={() => onChange(op.value)}
									className="duration-500 hover:bg-foreground/10 p-2 w-full rounded-lg text-left"
								>
									{op.label}
								</button>
							))
						: []}
				</div>
			</div>
		)
	},
)
