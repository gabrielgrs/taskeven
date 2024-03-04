import { cookies } from 'next/headers'

type Key = 'token' | 'cookie' | 'language'

export const setCookie = (key: Key, value: string) => {
  return cookies().set(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
}

export const getCookie = (key: Key) => cookies().get(key)?.value

export const removeCookie = (key: Key) => cookies().delete(key)
