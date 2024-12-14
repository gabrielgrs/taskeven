import { Schema } from 'mongoose'
import { createMongooseSchema } from '../helpers'

export type UserSchema = {
	_id: string
	name?: string
	email: string
	role: 'USER' | 'ADMIN'
	startTime: string
	endTime: string
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
			name: {
				type: String,
				required: false,
				trim: true,
			},
			startTime: {
				type: String,
				default: '00:00',
			},
			endTime: {
				type: String,
				default: '23:59',
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
