import { Schema, model } from 'mongoose'
const feedbackSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
)
export default model('feedbacks', feedbackSchema)
