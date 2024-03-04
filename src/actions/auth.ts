'use server'

import { ClientSession } from 'mongoose'
import { createToken, getTokenData } from '~/lib/jwt'
import schemas, { UserSchema } from '~/lib/mongoose'
import { sendEmail } from '~/lib/resend'
import { getCreditsBonusToRecharge, getExperienceByCredits } from '~/utils/configurations'
import { setCookie } from '~/utils/storage'
import { removeCookie } from '~/utils/storage'
import AuthEmail from '../../emails/auth'
import { parseObject } from './helpers'
import { getDomain } from './helpers/server'

type RequestData = {
  userId: string
  verificationCode: string
  token: string
}
const requestsQueue: RequestData[] = []

export async function findUserOrCreate(email: string, values: Partial<UserSchema> = {}) {
  const user = await schemas.user.findOne({ email })
  if (user) return parseObject(user)
  const createdUser = await schemas.user.create({ ...values, email })
  return parseObject(createdUser)
}

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export async function validateVerificationCode(verificationCode: string) {
  const foundElements = requestsQueue.filter((x) => x.verificationCode === verificationCode)
  if (foundElements.length === 0) throw Error('Invalid verification code')
  const last = foundElements[foundElements.length - 1]
  if (last.verificationCode !== verificationCode) throw Error('Invalid verification code')

  return last
}

export async function login(email: string) {
  const user = await findUserOrCreate(email)
  const { _id, role } = user

  const token = createToken({ email, _id, role })

  const verificationCode = randomNumber(100000, 999999).toString()

  requestsQueue.push({ userId: _id, verificationCode, token })

  await sendEmail(
    email,
    'Your magic link for Taskeven',
    AuthEmail({
      baseUrl: getDomain(),
      token,
      verificationCode: verificationCode,
    }),
  )

  return parseObject(user)
}

export async function oAuthLogin(email: string, values: Partial<UserSchema>) {
  const user = await findUserOrCreate(email, values)
  const { _id, role } = user
  const token = createToken({ email, _id, role })
  return token
}

export async function getAuthenticatedUser(): Promise<UserSchema | null> {
  const tokenData = await getTokenData()
  if (!tokenData) return null

  const user = await schemas.user.findOne({ email: tokenData.email })
  return parseObject(user)
}

export async function logout() {
  return removeCookie('token')
}

export async function refreshToken() {
  const tokenData = await getTokenData()
  if (!tokenData) return
  const newToken = await createToken({ _id: tokenData._id, email: tokenData.email, role: tokenData.role })
  setCookie('token', newToken)
}

export async function updateUserCredits(credits: number, type: 'increase' | 'decrease', session: ClientSession) {
  const user = await getAuthenticatedUser()
  if (!user) throw Error('Unauthorized access')

  const positiveCredits = Math.abs(credits)
  const creditsWithPercentage = positiveCredits + getCreditsBonusToRecharge(user.experience, positiveCredits)

  return schemas.user.findOneAndUpdate(
    { _id: user._id },
    {
      $inc: {
        credits: type === 'increase' ? creditsWithPercentage : positiveCredits * -1,
        experience: getExperienceByCredits(positiveCredits, type === 'increase'),
      },
    },
    { session, new: true },
  )
}

export async function updateUser({ name }: Partial<UserSchema>) {
  const user = await getTokenData()
  if (!user) throw Error('Unauthorized access')

  const updatedUser = await schemas.user.findOneAndUpdate({ _id: user._id }, { name }, { new: true })

  if (!updatedUser) throw Error('Not found')

  return parseObject(updatedUser)
}
