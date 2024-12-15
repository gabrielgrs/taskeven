import mongoose from 'mongoose'

import { insight } from './schemas/insight'
import { session } from './schemas/session'
import { task } from './schemas/task'
import { user } from './schemas/user'

let connection: typeof mongoose | null = null

export const connectDatabase = async (): Promise<typeof mongoose> => {
	if (connection) return connection
	connection = await mongoose.set('strictQuery', true).connect(process.env.MONGODB_URI as string)
	return connection
}

connectDatabase()

export const db = { user, task, insight, session }
