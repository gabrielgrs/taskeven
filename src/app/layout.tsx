import './globals.css'

import type { Metadata } from 'next'
import { Poppins as FontSans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ContactModal from '~/components/Contact'
import RootProviders from '~/components/providers/Root'
import ContactButton from '~/components/shared/ContactButton'
import { Toaster } from '~/components/ui/sonner'
import { isProductionBuild } from '~/utils/env'
import { cn } from '~/utils/shadcn'

const fontFamily = FontSans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
})

const image = 'https://taskeven.vercel.app/_next/image?url=%2Fassets%2Fthumbnail.png'

const meta = {
  title: 'Taskeven',
  description: 'Unleash Your Potential with Personal Task Management',
} as const

export const metadata: Metadata = {
  ...meta,
  title: {
    default: 'Taskeven',
    template: `%s - Taskeven`,
  },
  metadataBase: new URL(isProductionBuild ? 'https://taskeven.com' : 'http://localhost:3000'),
  manifest: '/manifest.json',
  openGraph: {
    ...meta,
    images: [{ url: image }],
  },
  twitter: {
    ...meta,
    card: 'summary_large_image',
    images: [image],
    creator: '@_taskeven',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const language = 'en' // await getLanguage()

  return (
    <html lang={language} style={{ scrollBehavior: 'smooth' }} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f9c890" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontFamily.variable)}>
        <RootProviders language={language}>
          <Toaster richColors closeButton />
          {children}
          <ContactModal>
            <ContactButton />
          </ContactModal>
        </RootProviders>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
