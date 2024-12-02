'use server'

import { Note } from '@/types'
import { z } from 'zod'
import { authProcedure } from './procedures'

export const createNote = authProcedure
	.input(
		z.object({
			title: z.string(),
			content: z.string().optional(),
			date: z.date().optional(),
			tags: z.array(z.string()),
		}),
	)
	.handler(async ({ input }) => {
		const createdNote: Note = {
			...input,
			_id: Math.random().toString(),
			tags: [],
		}

		return {
			note: createdNote,
		}
	})
