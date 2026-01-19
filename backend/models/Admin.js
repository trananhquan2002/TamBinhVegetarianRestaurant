import { Schema, model } from 'mongoose'
const adminSchema = new Schema(
  {
    userName: { type: String, required: true, unique: true },
    passWord: { type: String, required: true },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
)
export default model('admins', adminSchema)
