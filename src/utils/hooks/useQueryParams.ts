'use client'

import { useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const urlSearchParams = new URLSearchParams()

export function useQueryParams<T extends string>(key: string, defaultValue?: T): [T, (value: T) => void] {
  const { get } = useSearchParams()
  const [state, setState] = useState(get(key) || defaultValue)

  const setQuery = useCallback(
    (value: T) => {
      urlSearchParams.set(key, value)
      setState(urlSearchParams.get(key) || '')
      window.history.pushState(null, '', `?${urlSearchParams.toString()}`)
    },
    [key],
  )

  return [state as T, setQuery]
}
