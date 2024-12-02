import type { Note } from '@/types'

export function sortNotes(notes: Note[]) {
	return notes.sort((a, b) => {
		if (a.date && b.date) return b.date.getTime() - a.date.getTime()
		if (a.date) return -1
		if (b.date) return 1
		return 0
	})
}
