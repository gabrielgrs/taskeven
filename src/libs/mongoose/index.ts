import mongoose from 'mongoose'

import { user } from './schemas/user'

let connection: typeof mongoose | null = null

export const connectDatabase = async (): Promise<typeof mongoose> => {
	if (connection) return connection
	connection = await mongoose.set('strictQuery', true).connect(process.env.MONGODB_URI as string)
	return connection
}

connectDatabase()

export const db = { user }
