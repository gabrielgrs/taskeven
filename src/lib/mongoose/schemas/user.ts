import { Model, Schema, model, models } from 'mongoose'
import { INITIAL_CREDITS } from '~/utils/configurations'
import { EmailType, UserSchema } from './types'

const schema = new Schema<UserSchema>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    name: {
      type: String,
    },
    avatar: { type: String },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    credits: {
      type: Number,
      default: INITIAL_CREDITS,
    },
    experience: {
      type: Number,
      default: 0,
    },
    allowedEmailTypes: {
      type: [String],
      default: ['REMINDER'],
      enum: ['REMINDER'] satisfies EmailType[],
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
)

const currentModel = models?.User as Model<UserSchema>
export default currentModel || model<UserSchema>('User', schema)
