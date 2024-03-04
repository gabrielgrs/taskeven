'use server'

import { Language } from '~/utils/locales/types'
import { getCookie, setCookie } from '~/utils/storage'

export async function getLanguage() {
  const language = getCookie('language')

  const allowedLanguages: Language[] = ['pt', 'en']
  if (allowedLanguages.includes(language as Language)) return language as Language

  return 'en'
}

export async function changeLanguage(language: Language) {
  return setCookie('language', language)
}
