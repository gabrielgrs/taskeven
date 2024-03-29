import mongoose from 'mongoose'
import checkout from './schemas/checkout'
import space from './schemas/space'

let db: typeof mongoose | null = null

export const connectDatabase = async (): Promise<typeof mongoose> => {
  if (db) return db
  db = await mongoose.set('strictQuery', true).connect(process.env.MONGODB_URI as string)
  return db
}

connectDatabase()

const schemas = {
  space,
  checkout,
}

export * from './schemas/types'

export default schemas
