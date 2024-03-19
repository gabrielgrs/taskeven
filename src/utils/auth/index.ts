import { cookies } from 'next/headers'
import { decodeToken } from '~/libs/jose'

export const getTokenData = () => decodeToken(cookies().get('token')?.value!)
