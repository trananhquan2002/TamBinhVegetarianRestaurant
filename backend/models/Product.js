import { Schema, model } from 'mongoose'
const productSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    desc: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: 'categories' },
    isAvailable: { type: Boolean, default: true },
  },
  { versionKey: false }
)
export default model('products', productSchema)
