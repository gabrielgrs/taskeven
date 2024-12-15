'use client'

import { getInsights } from '@/actions/insight'
import { InsightSchema } from '@/libs/mongoose/schemas/insight'
import { useQuery } from '@tanstack/react-query'

type Data = {
	insights: InsightSchema[]
}

export function useInsights() {
	const { data, refetch } = useQuery({
		queryKey: ['insights'],
		queryFn: async (): Promise<Data> => {
			const [insights, error] = await getInsights()
			if (error)
				return {
					insights: [],
				}

			return {
				insights,
			}
		},
	})

	return {
		insights: data?.insights ?? [],
		refetch,
	}
}
