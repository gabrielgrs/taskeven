import { ObjectId, Schema } from 'mongoose'
import { createMongooseSchema } from '../helpers'

export type InsightSchema = {
	_id: string
	user: ObjectId
	content: string
	date: Date
	createdAt: Date
	updatedAt: Date
}

export const insight = createMongooseSchema<InsightSchema>(
	'Insight',
	new Schema<InsightSchema>(
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
			content: {
				type: String,
				required: true,
			},
			date: {
				type: Date,
				required: true,
			},
		},
		{
			timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
		},
	),
)
