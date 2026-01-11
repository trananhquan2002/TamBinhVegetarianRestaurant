const mongoose = require('mongoose')
const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['order', 'reservation', 'feedback'], required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
)
module.exports = mongoose.model('notifications', notificationSchema)
