import { Schema, model } from 'mongoose'
const orderSchema = new Schema(
  {
    orderCode: { type: String, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'users', default: null },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      detail: { type: String, default: '' },
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    cartItems: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'products' },
        title: { type: String },
        quantity: { type: Number },
        price: { type: Number },
        image: { type: String },
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
export default model('orders', orderSchema)
