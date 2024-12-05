import './globals.css'
import { ClientLayout } from '@/components/client-layout'
import { Navbar } from '@/components/navbar'
import NextTopLoader from 'nextjs-toploader'

import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'

const font = Poppins({ weight: ['400', '500', '600'], subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Taskeven',
	description: '',
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={`${font.className} min-h-screen bg-background text-foreground antialiased`}>
				<ClientLayout>
					<NextTopLoader color="hsl(var(--primary))" showSpinner={false} />

					<Navbar />
					<div className="mx-auto max-w-7xl px-8 py-16">{children}</div>
					<Toaster />
				</ClientLayout>
			</body>
		</html>
	)
}
