import { Model, Schema, model, models } from 'mongoose'
import { ListSchema } from './types'

const schema = new Schema<ListSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    members: {
      type: [
        {
          user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          permission: { type: String, enum: ['VIEW', 'EDIT'], default: 'VIEW' },
          accepted: { type: Boolean, default: false },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    tasks: {
      type: [
        {
          title: { type: String, required: true },
          completed: { type: Boolean, default: false },
          reminderDate: { type: Date, required: false },
          annotations: { type: String, required: false },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
)

const currentModel = models?.List as Model<ListSchema>
export default currentModel || model<ListSchema>('List', schema)
