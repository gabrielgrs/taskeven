import { Model, Schema, model, models } from 'mongoose'
import { UserSchema } from './types'

const schema = new Schema<UserSchema>(
  {
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
)

const currentModel = models?.User as Model<UserSchema>
export default currentModel || model<UserSchema>('User', schema)
