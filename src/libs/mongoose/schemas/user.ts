import { Schema } from 'mongoose'
import { createMongooseSchema } from '../helpers'

export type UserSchema = {
	_id: string
	email: string
	role: 'USER' | 'ADMIN'
	stripeCustomerId: string
	stripeSubscriptionId?: string
	createdAt: Date
	updatedAt: Date
}

export const user = createMongooseSchema<UserSchema>(
	'User',
	new Schema<UserSchema>(
		{
			email: {
				type: String,
				required: true,
				unique: true,
			},
			role: {
				type: String,
				required: true,
				enum: ['USER', 'ADMIN'],
				default: 'USER',
			},
			stripeCustomerId: {
				type: String,
				required: true,
			},
			stripeSubscriptionId: {
				type: String,
			},
		},
		{
			timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
		},
	),
)
