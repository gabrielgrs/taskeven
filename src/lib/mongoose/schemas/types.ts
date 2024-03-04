import { type Types } from 'mongoose'

export type TaskSchema = {
  _id: string
  title: string
  completed: boolean
  createdBy: Types.ObjectId
  reminderDate?: Date
  annotations?: string
  createdAt: Date
}

export type MemberSchema = {
  _id: string
  user: UserSchema
  permission: 'VIEW' | 'EDIT'
  accepted: boolean
  createdAt: Date
}

// type SubSchemas = 'tasks' | 'members'

export type EmailType = 'REMINDER'

export type UserSchema = {
  _id: string
  email: string
  name: string
  avatar: string
  role: 'USER' | 'ADMIN'
  credits: number
  experience: number
  allowedEmailTypes: EmailType[]
}

export type ListSchema = {
  _id: string
  name: string
  slug: string
  tasks: TaskSchema[]
  members: MemberSchema[]
  createdBy: Types.ObjectId
}

export type CheckoutSchema = {
  _id: string
  payer: Types.ObjectId
  price: number
  status: 'PENDING' | 'SUCCESS' | 'FAILURE'
  checkoutId: string
}

export type MailingSchema = {
  email: string
}
