import { englishTexts } from './en'
import { portugueseTexts } from './pt'
import { Language, Locale } from './types'

const texts: Record<Language, Locale> = {
  en: englishTexts,
  pt: portugueseTexts,
}

export function getLocales(language: Language) {
  return texts[language]
}
