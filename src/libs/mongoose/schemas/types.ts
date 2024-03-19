import { Types } from 'mongoose'
import { PlanName } from '~/utils/constants/types'

export type Role = 'USER' | 'ADMIN'

type Metadata = Record<string, string | number | boolean>

export type UserSchema = {
  _id: string
  email: string
  role: Role
  createdAt: Date
  updatedAt: Date
}

export type TaskSchema = {
  _id: string
  title: string
  completed: boolean
  // text?: string
  date: Date
  createdAt: Date
}

export type SpaceSchema = {
  _id: string
  name: string
  slug: string
  plan: PlanName
  tasks: TaskSchema[]
  members: string[]
  createdBy: string
}

export type CheckoutSchema = {
  _id: string
  payer: Types.ObjectId
  price: number
  status: 'PENDING' | 'SUCCESS' | 'FAILURE'
  checkoutId: string
  metadata?: Metadata
}
