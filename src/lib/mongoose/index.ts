import mongoose from 'mongoose'
import checkout from './schemas/checkout'
import list from './schemas/list'
import user from './schemas/user'
import waitList from './schemas/waitList'

let db: typeof mongoose | null = null

export const connectDatabase = async (): Promise<typeof mongoose> => {
  if (db) return db
  db = await mongoose.set('strictQuery', true).connect(process.env.MONGODB_URI as string)
  return db
}

connectDatabase()

const schemas = {
  user,
  list,
  checkout,
  waitList,
}

export * from './schemas/types'

export default schemas
