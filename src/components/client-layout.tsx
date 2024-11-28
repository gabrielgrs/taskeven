'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { OnlyClient } from './only-client'

const client = new QueryClient()

export function ClientLayout({ children }: { children: ReactNode }) {
	return (
		<OnlyClient>
			<QueryClientProvider client={client}>
				<ThemeProvider enableSystem attribute="class">
					{children}
				</ThemeProvider>
			</QueryClientProvider>
		</OnlyClient>
	)
}
