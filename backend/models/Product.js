const mongoose = require('mongoose')
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    desc: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
    isAvailable: { type: Boolean, default: true },
  },
  { versionKey: false }
)
module.exports = mongoose.model('products', productSchema)
