'use client'

import { ReactNode } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Language } from '~/utils/locales/types'
import LanguageProvider from './Language'
import ThemeProvider from './Theme'

type Props = {
  children: ReactNode
  language: Language
}

const queryClient = new QueryClient()

export default function RootProviders({ children, language }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider language={language}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}
