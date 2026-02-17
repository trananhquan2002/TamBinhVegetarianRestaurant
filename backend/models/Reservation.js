import { Schema, model } from 'mongoose'
const reservationSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    quantity: { type: Number, required: true },
    time: { type: Date, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    relatedId: { type: Schema.Types.ObjectId },
  },
  { versionKey: false, timestamps: true }
)
export default model('reservations', reservationSchema)
