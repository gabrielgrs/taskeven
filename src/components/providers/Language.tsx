'use client'

import { ReactNode, createContext, useCallback, useContext, useState } from 'react'
import { changeLanguage } from '~/actions/laguage'
import { getLocales } from '~/utils/locales'
import { Language } from '~/utils/locales/types'

type LanguageContext = {
  language: Language
  onChangeLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContext>({
  language: 'en',
  onChangeLanguage: () => null,
})

export default function LanguageProvider({ children, language }: { children: ReactNode; language: Language }) {
  const [_language, setLanguage] = useState<Language>(language)

  const onChangeLanguage = useCallback((languageToSet: Language) => {
    changeLanguage(languageToSet)
    setLanguage(languageToSet)
  }, [])

  return (
    <LanguageContext.Provider value={{ language: _language, onChangeLanguage }}>{children}</LanguageContext.Provider>
  )
}

export const useLocales = () => {
  const { language, ...rest } = useContext(LanguageContext)
  return {
    ...getLocales(language),
    ...rest,
    currentLanguage: language,
  }
}
