type Metadata = Record<string, string | number | boolean>

export type TaskSchema = {
  _id: string
  title: string
  completed: boolean
  reminderDate: Date
  createdAt: Date
}

export type SpaceSchema = {
  _id: string
  name: string
  slug: string
  isPaid: boolean
  tasks: TaskSchema[]
  createdBy: string
}

export type CheckoutSchema = {
  _id: string
  payer: string
  price: number
  status: 'PENDING' | 'SUCCESS' | 'FAILURE'
  checkoutId: string
  metadata?: Metadata
}
