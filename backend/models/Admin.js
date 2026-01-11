const mongoose = require('mongoose')
const adminSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    passWord: { type: String, required: true },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
)
module.exports = mongoose.model('admins', adminSchema)
