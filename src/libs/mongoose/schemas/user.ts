import { Model, Schema, model, models } from 'mongoose'
import { Role as UserRole, UserSchema } from './types'

const schema = new Schema<UserSchema>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'] as UserRole[],
      default: 'USER',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
)

const currentModel = models?.User as Model<UserSchema>
export default currentModel || model<UserSchema>('User', schema)
