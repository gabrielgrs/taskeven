export type Note = {
	_id: string
	title: string
	content: string
	date?: Date
	tags: Tag[]
}

export type Tag = {
	_id: string
	name: string
	backgroundColor: string
}

export type DefaultValues = {
	tags: Tag[]
}
