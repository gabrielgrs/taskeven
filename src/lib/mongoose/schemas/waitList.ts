import { Model, Schema, model, models } from 'mongoose'

type WailtListSchema = {
  _id: string
  email: string
}

const schema = new Schema<WailtListSchema>(
  {
    email: {
      type: String,
      required: true,

      lowercase: true,
      trim: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
)

const currentModel = models?.WaitList as Model<WailtListSchema>
export default currentModel || model<WailtListSchema>('WaitList', schema)
