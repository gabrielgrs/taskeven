'use client'

import { cn } from '@/libs/utils'
import { X } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Tag } from './tag'

type Item = {
	value: string
	label: string
}

type Props = {
	options: Item[]
	value: Item[]
	onChange: (item: Item[]) => void
	className?: string
	placeholder?: string
}

export function InputTags({
	options = [],
	value = [],
	onChange,
	className,
	placeholder = 'Select or type and press enter',
}: Props) {
	const [isActive, setIsActive] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const filteredOptions = options.filter((x) => !value.some((y) => y.value === x.value))

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && inputRef.current) {
				if (!dropdownRef.current.contains(event.target as Node) && !inputRef.current?.contains(event.target as Node))
					setIsActive(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div
			className={cn(
				'relative bg-secondary w-full h-10 px-1 py-2 rounded border border-input grid grid-cols-[max-content,auto] items-center gap-2 flex-wrap',
				isActive && 'ring-2 ring-ring ring-offset-2',
				className,
			)}
		>
			<div className="flex items-center gap-1">
				{value.map((item, index) => (
					<motion.div
						layoutId={item.value}
						key={`${item.value}_${index}`}
						className="bg-secondary-foreground/10 rounded flex items-center gap-1 px-1 w-max"
					>
						<span className="text-sm translate-y-[-1px]">{item.label}</span>
						<button
							type="button"
							className="h-4 w-4 flex items-center justify-center"
							onClick={() => onChange(value.filter((_, i) => i !== index))}
						>
							<X size={16} />
						</button>
					</motion.div>
				))}
			</div>
			<input
				ref={inputRef}
				className="w-full h-full bg-transparent focus:outline-none focus:ring-0"
				placeholder={placeholder}
				onFocus={(e) => {
					setIsActive(true)
					return e
				}}
				onBlur={(e) => {
					// setTimeout(() => setIsActive(false), 300)
					return e
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter' && inputRef.current) {
						e.preventDefault()
						const tag = inputRef.current.value
						if (tag) {
							inputRef.current.value = ''
							onChange(value.concat({ value: tag, label: tag }))
						}
					}
				}}
			/>
			<div
				ref={dropdownRef}
				className={cn(
					'duration-500 overflow-hidden absolute left-0 top-[120%] bg-secondary border border-input rounded w-full p-2 flex items-center gap-2 flex-wrap z-10',
					!isActive && 'pointer-events-none h-0 max-h-0 p-0 opacity-0',
				)}
			>
				{filteredOptions.length === 0 && (
					<span className="text-sm text-center w-full text-muted-foreground">No options found</span>
				)}
				{filteredOptions.map((item) => (
					<motion.button
						layoutId={item.value}
						key={item.value}
						onClick={() => onChange(value.concat(item))}
						className=""
					>
						<Tag>{item.label}</Tag>
					</motion.button>
				))}
			</div>
		</div>
	)
}
