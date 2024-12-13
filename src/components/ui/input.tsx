import { cn } from '@/libs/utils'
import formatStringByPattern from 'format-string-by-pattern'
import * as React from 'react'

const Input = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<'input'> & { mask?: string; onlyNumbers?: boolean }
>(({ className, type, mask, onChange, onlyNumbers, ...props }, ref) => {
	return (
		<input
			type={type}
			className={cn(
				'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
				className,
			)}
			ref={ref}
			onChange={(event) => {
				const { value } = event.target

				if (onlyNumbers) {
					event.target.value = value.replace(/[^0-9]/g, '')
				}

				if (mask) {
					event.target.value = formatStringByPattern(mask, value)
				}

				onChange?.(event)
			}}
			{...props}
		/>
	)
})
Input.displayName = 'Input'

export { Input }
