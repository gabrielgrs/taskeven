'use client'

import type { Tag } from '@/app/(private)/app/template/types'
import { faker } from '@faker-js/faker'
import { useQuery } from '@tanstack/react-query'

const mockedTags: Tag[] = Array(3)
	.fill(0)
	.map(() => {
		return {
			_id: Math.random().toString(36).substring(2, 15),
			name: faker.lorem.word(),
			backgroundColor: faker.internet.color(),
		}
	})

export function useTags() {
	const { data: tags = [] } = useQuery({
		queryKey: ['tags'],
		queryFn: async () => {
			return mockedTags
		},
	})

	return {
		tags,
	}
}
