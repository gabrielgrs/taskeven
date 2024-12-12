import { ObjectId, Schema } from 'mongoose'
import { createMongooseSchema } from '../helpers'

export type TaskSchema = {
	_id: string
	user: ObjectId
	completed: boolean
	tags: string[]
	title: string
	duration: number
	date?: Date
	createdAt: Date
	updatedAt: Date
}

export const task = createMongooseSchema<TaskSchema>(
	'Task',
	new Schema<TaskSchema>(
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true,
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
			duration: {
				type: Number,
				default: 0,
			},
			date: Date,
		},
		{
			timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
		},
	),
)
