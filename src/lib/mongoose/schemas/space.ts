import { Model, Schema, model, models } from 'mongoose'
import { SpaceSchema } from './types'

const schema = new Schema<SpaceSchema>(
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
      type: [String],
      default: [],
    },
    createdBy: {
      type: String,
      required: true,
    },
    tasks: {
      type: [
        {
          title: { type: String, required: true },
          completed: { type: Boolean, default: false },
          date: { type: Date, required: false },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
)

const currentModel = models?.Space as Model<SpaceSchema>
export default currentModel || model<SpaceSchema>('Space', schema)
