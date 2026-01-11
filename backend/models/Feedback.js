const mongoose = require('mongoose')
const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'unread' },
  },
  { timestamps: true, versionKey: false }
)
module.exports = mongoose.model('feedbacks', feedbackSchema)
