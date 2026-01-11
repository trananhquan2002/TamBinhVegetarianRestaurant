const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    passWord: { type: String, required: true },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
)
module.exports = mongoose.model('users', userSchema)
