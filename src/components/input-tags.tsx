'use client'

import { TagInput, type Tag as TypeTag } from 'emblor'
import { useState } from 'react'
import { Tag } from './tag'

type Props = {
	suggestions: TypeTag[]
	value: TypeTag[]
	onChange: (tags: [TypeTag, ...TypeTag[]]) => void
}

export function InputTags({ suggestions, value = [], onChange }: Props) {
	const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)

	return (
		<div className="flex items-center gap-4">
			<TagInput
				placeholder="Type a tag name"
				tags={value}
				setTags={(newTags) => {
					onChange(newTags as [TypeTag, ...TypeTag[]])
				}}
				activeTagIndex={activeTagIndex}
				setActiveTagIndex={setActiveTagIndex}
			/>
			{suggestions
				.filter((x) => !value.some((y) => x.text === y.text))
				.map((tag) => (
					<button type="button" key={tag.id} onClick={() => onChange(value.concat(tag) as [TypeTag, ...TypeTag[]])}>
						<Tag>{tag.text}</Tag>
					</button>
				))}
		</div>
	)
}
