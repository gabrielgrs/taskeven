import { Schema } from 'mongoose'
import { createMongooseSchema } from '../helpers'

const roles = ['ADMIN', 'USER'] as const
type Role = (typeof roles)[number]

// export type TagSchema = {
// 	_id: string
// 	name: string
// 	backgroundColor: string
// }

export type TaskSchema = {
	_id: string
	tags: string[]
	title: string
	content?: string
	date?: Date
}

export type UserSchema = {
	_id: string
	email: string
	name: string
	role: Role
	tasks: TaskSchema[]
	createdAt: Date
	updatedAt: Date
}

const taskSchema = new Schema<TaskSchema>({
	title: {
		type: String,
		required: true,
	},
	tags: [String],
	content: String,
	date: Date,
})

export const user = createMongooseSchema<UserSchema>(
	'User',
	new Schema<UserSchema>(
		{
			email: {
				type: String,
				required: true,
				unique: true,
				lowercase: true,
				trim: true,
			},
			tasks: [taskSchema],
			name: {
				type: String,
				required: true,
			},
			role: {
				type: String,
				required: false,
				default: 'USER',
				enum: roles,
			},
		},
		{
			timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
		},
	),
)
