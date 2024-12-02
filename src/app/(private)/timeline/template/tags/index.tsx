'use client'

import Grid from '@/components/Grid'
import Column from '@/components/Grid/Column'
import { Tag } from '@/components/tag'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import type { DefaultValues } from '../types'

export function Tags() {
	const [inEditionTagId, setInEditionTagId] = useState('')
	const { control, register } = useFormContext<DefaultValues>()
	const { fields, append, remove } = useFieldArray({ control, name: 'tags' })

	return (
		<Grid>
			<Column size={12} className="flex items-center gap-2 flex-wrap">
				{fields.map((tag, index) => {
					if (tag._id === inEditionTagId) {
						return (
							<div key={tag._id} className="flex items-center gap-2">
								<input
									key={tag._id}
									{...register(`tags.${index}.name`)}
									className="bg-foreground/5 rounded-full px-2 outline-none min-w-9 w-auto"
									placeholder="Type the tag name"
								/>
								<input type="color" className="h-8 w-8 rounded-full" />
							</div>
						)
					}

					return (
						<Tag key={tag._id} backgroundColor={tag.backgroundColor}>
							{tag.name}
						</Tag>
					)
				})}
				{inEditionTagId !== '' ? (
					<>
						<button type="button" className="text-green-500" onClick={() => setInEditionTagId('')}>
							<Check />
						</button>
						<button
							type="button"
							className="text-red-500"
							onClick={() => {
								setInEditionTagId('')
								remove(fields.length - 1)
							}}
						>
							<X />
						</button>
					</>
				) : (
					<Button
						size="sm"
						className="h-6"
						onClick={() => {
							const _id = Math.random().toString()
							setInEditionTagId(_id)
							return append({ name: '', backgroundColor: '#f1f1f1', _id })
						}}
					>
						Add
					</Button>
				)}
			</Column>
		</Grid>
	)
}
