import { Schema, model } from 'mongoose'
const notificationSchema = new Schema(
  {
    type: { type: String, enum: ['order', 'reservation', 'feedback'], required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    relatedId: { type: Schema.Types.ObjectId }
  },
  { versionKey: false, timestamps: true }
)
export default model('notifications', notificationSchema)
