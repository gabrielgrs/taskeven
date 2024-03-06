export type UserSchema = {
  _id: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export type TaskSchema = {
  _id: string
  title: string
  completed: boolean
  date: Date
  createdAt: Date
}

export type SpaceSchema = {
  _id: string
  name: string
  slug: string
  tasks: TaskSchema[]
  members: string[]
  createdBy: string
}
