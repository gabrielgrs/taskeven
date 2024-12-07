import { Schema } from 'mongoose'
import { createMongooseSchema } from '../helpers'

export type TaskSchema = {
	_id: string
	email?: string
	ip: string
	paid: boolean
	completed: boolean
	tags: string[]
	title: string
	date?: Date
	createdAt: Date
	updatedAt: Date
}

export const task = createMongooseSchema<TaskSchema>(
	'Task',
	new Schema<TaskSchema>(
		{
			email: {
				type: String,
				required: false,
			},
			ip: {
				type: String,
				required: true,
			},
			paid: {
				type: Boolean,
				default: false,
				required: false,
			},
			title: {
				type: String,
				required: true,
			},
			completed: {
				type: Boolean,
				default: false,
			},
			tags: [String],
			date: Date,
		},
		{
			timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
		},
	),
)
