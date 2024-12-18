import './globals.css'
import { ClientLayout } from '@/components/client-layout'
import NextTopLoader from 'nextjs-toploader'

import { generateMetadata } from '@/utils/metadata'
import { Source_Code_Pro } from 'next/font/google'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'

const font = Source_Code_Pro({
	weight: ['400', '500', '600'],
	subsets: ['latin'],
})

export const metadata = generateMetadata()

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
			</head>
			<body className={`${font.className} min-h-screen bg-background text-foreground antialiased tracking-tighter	`}>
				<ClientLayout>
					<NextTopLoader color="hsl(var(--primary))" showSpinner={false} />

					{children}
					<Toaster />
				</ClientLayout>
			</body>
		</html>
	)
}
