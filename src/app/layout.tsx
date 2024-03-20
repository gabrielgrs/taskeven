import './globals.css'

import type { Metadata } from 'next'
import { Poppins as FontSans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import RootProviders from '~/components/providers/Root'
import Footer from '~/components/shared/Footer'
import Navbar from '~/components/shared/Navbar'
import { Toaster } from '~/components/ui/sonner'
import { APP_DOMAIN, APP_NAME, APP_SLOGAN } from '~/utils/constants'
import { cn } from '~/utils/shadcn'

const fontFamily = FontSans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
})

const image = 'https://taskeven.vercel.app/_next/image?url=%2Fassets%2Fthumbnail.png'

const meta = {
  title: APP_NAME,
  description: APP_SLOGAN,
} as const

export const metadata: Metadata = {
  ...meta,
  title: {
    default: APP_NAME,
    template: `%s - ${APP_NAME}`,
  },
  metadataBase: new URL(APP_DOMAIN),
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
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f9c890" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontFamily.variable)}>
        <RootProviders>
          <Toaster richColors closeButton />
          <Navbar />
          <div className="mx-auto max-w-xl">{children}</div>
          <Footer className="px-4 bg-background/80 backdrop-blur-sm" />
        </RootProviders>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
