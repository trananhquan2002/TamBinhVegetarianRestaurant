const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      detail: { type: String, default: '' },
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    cartItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        title: String,
        quantity: Number,
        price: Number,
      },
    ],
    subTotal: { type: Number, default: 0 },
    distance: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    paymentMethod: { type: String, default: 'COD' },
    status: { type: String, default: 'pending' },
    paymentStatus: { type: String, default: 'unpaid' },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false, timestamps: true }
)
module.exports = mongoose.model('orders', orderSchema)
