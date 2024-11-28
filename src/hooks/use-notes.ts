'use client'

import type { Note, Tag } from '@/app/(private)/app/template/types'
import { faker } from '@faker-js/faker'
import { useQuery } from '@tanstack/react-query'
const randomNumber = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

const randomBoolean = () => {
	return Math.random() < 0.5
}

const mockedNotes: Note[] = Array.from({ length: 5 }).map(() => {
	return {
		_id: Math.random().toString(36).substring(2, 15),
		title: faker.book.title(),
		content: faker.lorem.paragraphs(2),
		date: randomBoolean() ? faker.date.recent() : undefined,
		tags: Array.from({ length: randomNumber(1, 3) }).map(() => {
			return {
				_id: Math.random().toString(36).substring(2, 15),
				name: faker.lorem.word(),
				backgroundColor: faker.internet.color(),
			} satisfies Tag
		}),
	}
})

export function useNotes() {
	const { data: notes = [] } = useQuery({
		queryKey: ['notes'],
		queryFn: async () => {
			return mockedNotes.sort((a, b) => {
				if (a.date && b.date) return b.date.getTime() - a.date.getTime()
				if (a.date) return -1
				if (b.date) return 1
				return 0
			})
		},
	})

	return {
		notes,
	}
}
