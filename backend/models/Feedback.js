import { Schema, model } from 'mongoose'
const feedbackSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'unread' },
  },
  { timestamps: true, versionKey: false }
)
export default model('feedbacks', feedbackSchema)
