const mongoose = require('mongoose')
const reservationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    quantity: { type: Number, required: true },
    time: { type: Date, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
)
module.exports = mongoose.model('reservations', reservationSchema)
