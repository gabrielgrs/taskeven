'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'
import { OnlyClient } from './only-client'

const client = new QueryClient()

export function ClientLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname()

	useEffect(() => {
		if (pathname)
			window.scrollTo({
				top: 0,
			})
	}, [pathname])

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
