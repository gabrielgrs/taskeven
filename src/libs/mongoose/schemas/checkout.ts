import { Model, Schema, model, models } from 'mongoose'
import { CheckoutSchema } from './types'

const schema = new Schema<CheckoutSchema>(
  {
    payer: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['FAILURE', 'PENDING', 'SUCCESS'] satisfies CheckoutSchema['status'][],
      default: 'PENDING',
    },
    price: {
      type: Number,
      required: true,
    },
    checkoutId: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
)

const currentModel = models?.Checkout as Model<CheckoutSchema>
export default currentModel || model<CheckoutSchema>('Checkout', schema)
