import { Router } from 'express'
const router = Router()
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import User from '../models/User.js'
import Reservation from '../models/Reservation.js'
import Feedback from '../models/Feedback.js'
import Order from '../models/Order.js'
import Notification from '../models/Notification.js'
import Admin from '../models/Admin.js'
const SECRET_KEY = process.env.JWT_SECRET

// ==========================================
// MIDDLEWARE PHÂN QUYỀN (AUTHORIZATION)
// ==========================================

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Bạn chưa đăng nhập!' })
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' })
    req.user = decoded
    next()
  })
}

const isAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next()
    } else {
      res.status(403).json({ message: 'Bạn không có quyền truy cập khu vực quản trị!' })
    }
  })
}

// ==========================================
// 1. NHÓM API ĐƠN HÀNG (ORDERS)
// ==========================================

router.post('/orders', async (req, res) => {
  try {
    const { customerId, customerName, phone, address, distance, paymentMethod, cartItems } = req.body
    if (!cartItems || cartItems.length === 0) return res.status(400).json({ message: 'Giỏ hàng trống' })
    const itemsWithFullData = await Promise.all(
      cartItems.map(async (item) => {
        const productInfo = await Product.findById(item.productId)
        if (!productInfo) throw new Error(`Sản phẩm ${item.productId} không tồn tại`)
        return {
          productId: productInfo._id,
          title: productInfo.title,
          quantity: item.quantity,
          price: productInfo.price,
        }
      })
    )
    const subTotal = itemsWithFullData.reduce((total, item) => total + item.price * item.quantity, 0)
    let shippingFee = distance > 10 ? 15000 + (Math.ceil(distance) - 10) * 5000 : 0
    const totalAmount = subTotal + shippingFee
    const orderCode = `TB${Date.now().toString().slice(-6)}`
    const newOrder = new Order({
      orderCode,
      customerId,
      customerName,
      phone,
      address,
      cartItems: itemsWithFullData,
      subTotal,
      distance,
      shippingFee,
      totalAmount,
      paymentMethod: paymentMethod || 'COD',
      status: 'pending',
      paymentStatus: 'unpaid',
    })
    await newOrder.save()
    const newNoti = new Notification({
      type: 'order',
      content: `Đơn hàng mới ${orderCode} từ khách ${customerName} (${totalAmount.toLocaleString()}đ)`,
      isRead: false,
    })
    await newNoti.save()
    const io = req.app.get('socketio')
    if (io) {
      io.emit('new_activity', newNoti)
      io.emit('update_stats')
    }
    res.status(200).json({ success: true, order: newOrder })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.get('/orders', isAdmin, async (req, res) => {
  try {
    const { date } = req.query
    let query = {}
    if (date) {
      const start = new Date(date)
      start.setHours(0, 0, 0, 0)
      const end = new Date(date)
      end.setHours(23, 59, 59, 999)
      query.createdAt = { $gte: start, $lte: end }
    }
    const orders = await Order.find(query).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/orders/:id/status', isAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true })
    if (!updatedOrder) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    const io = req.app.get('socketio')
    if (io) io.to(id).emit('order-status-updated', updatedOrder)
    res.status(200).json(updatedOrder)
  } catch (err) {
    res.status(400).json({ message: 'Lỗi cập nhật: ' + err.message })
  }
})

router.get('/orders/last-info/:customerId', verifyToken, async (req, res) => {
  try {
    const lastOrder = await Order.findOne({ customerId: req.params.customerId }).sort({ createdAt: -1 })
    if (!lastOrder) return res.status(404).json({ message: 'Chưa có đơn hàng cũ' })
    res.json({ customerName: lastOrder.customerName, phone: lastOrder.phone, address: lastOrder.address })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ==========================================
// 2. NHÓM API ĐẶT BÀN (RESERVATIONS)
// ==========================================

router.post('/reservation', async (req, res) => {
  const { fullName, phone, quantity, time } = req.body
  try {
    if (!fullName || !phone || !quantity || !time) return res.status(400).json({ message: 'Thiếu thông tin!' })
    const existing = await Reservation.findOne({ phone, status: 'pending' })
    if (existing) return res.status(400).json({ message: 'Số điện thoại này đang có lịch chờ!' })
    const newReservation = new Reservation({ fullName, phone, quantity, time: new Date(time) })
    await newReservation.save()
    const newNoti = new Notification({
      type: 'reservation',
      content: `Khách hàng ${fullName} vừa đặt bàn cho ${quantity} người`,
      isRead: false,
    })
    await newNoti.save()
    const io = req.app.get('socketio')
    if (io) {
      io.emit('new_activity', newNoti)
      io.emit('update_stats')
    }
    res.json({ success: true, reservation: newReservation })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server!' })
  }
})

router.get('/reservations', isAdmin, async (req, res) => {
  try {
    const { date } = req.query
    let query = {}
    if (date) {
      const start = new Date(date)
      start.setHours(0, 0, 0, 0)
      const end = new Date(date)
      end.setHours(23, 59, 59, 999)
      query.time = { $gte: start, $lte: end }
    }
    const data = await Reservation.find(query).sort({ createdAt: -1 })
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/reservations/:id/status', isAdmin, async (req, res) => {
  try {
    const updated = await Reservation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy!' })
    const io = req.app.get('socketio')
    if (io) io.to(req.params.id).emit('reservation-status-updated', updated)
    res.status(200).json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ==========================================
// 3. NHÓM API GÓP Ý (FEEDBACKS)
// ==========================================

router.post('/feedback', async (req, res) => {
  const { name, phone, message } = req.body
  try {
    if (!name || !phone || !message) return res.status(400).json({ message: 'Thiếu thông tin!' })
    const newFeedback = new Feedback({ name, phone, message, createdAt: new Date() })
    await newFeedback.save()
    const newNoti = new Notification({ type: 'feedback', content: `Khách hàng ${name} vừa gửi góp ý`, isRead: false })
    await newNoti.save()
    const io = req.app.get('socketio')
    if (io) io.emit('new_activity', newNoti)
    return res.status(200).json({ message: 'Cảm ơn bạn đã góp ý!' })
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi server!' })
  }
})

router.get('/feedbacks', isAdmin, async (req, res) => {
  try {
    const data = await Feedback.find().sort({ createdAt: -1 })
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ==========================================
// 4. NHÓM API THỰC ĐƠN
// ==========================================

router.get('/menu', async (req, res) => {
  try {
    const menuItems = await Product.find()
    res.status(200).json({ data: menuItems })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/categories', async (req, res) => {
  try {
    const cats = await Category.find()
    res.status(200).json(cats)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ==========================================
// 5. NHÓM API AUTH (USER & ADMIN)
// ==========================================

router.post('/register', async (req, res) => {
  const { userName, passWord } = req.body
  try {
    const userExists = await User.findOne({ userName })
    if (userExists) {
      return res.status(400).json({ message: 'Tên đăng nhập này đã được đăng ký!' })
    }
    const hashedPassword = await bcrypt.hash(passWord, 10)
    const newUser = new User({
      userName,
      passWord: hashedPassword,
    })
    await newUser.save()
    res.status(200).json({ message: 'Đăng ký tài khoản thành công!' })
  } catch (err) {
    console.error('Lỗi đăng ký User:', err)
    res.status(500).json({ message: 'Lỗi server khi đăng ký thành viên' })
  }
})

router.post('/login', async (req, res) => {
  const { userName, passWord } = req.body
  try {
    const user = await User.findOne({ userName })
    if (!user || !(await bcrypt.compare(passWord, user.passWord))) {
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu!' })
    }
    const token = jwt.sign({ id: user._id, role: 'user' }, SECRET_KEY, { expiresIn: '7d' })
    const { passWord: _, ...data } = user._doc
    res.status(200).json({ ...data, token })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi đăng nhập' })
  }
})

router.post('/loginGoogle', async (req, res) => {
  try {
    const token = req.headers.tokengoogle
    if (!token) return res.status(400).json({ message: 'Thiếu Token' })
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
    const userInfo = await response.json()
    if (!userInfo || userInfo.error) {
      return res.status(401).json({ message: 'Token Google không hợp lệ' })
    }
    let user = await User.findOneAndUpdate({ userName: userInfo.name }, { avatar: userInfo.picture }, { new: true, upsert: true })
    if (!user.role) {
      user.role = 'user'
      await user.save()
    }
    const sysToken = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '7d' })
    res.status(200).json({
      _id: user._id,
      userName: user.userName,
      role: user.role,
      avatar: user.avatar,
      token: sysToken,
    })
  } catch (error) {
    console.error('Lỗi xác thực Google:', error)
    res.status(500).json({ message: 'Lỗi hệ thống' })
  }
})

router.post('/register-admin', async (req, res) => {
  const { userName, passWord } = req.body
  try {
    const exists = await Admin.findOne({ userName })
    if (exists) return res.status(400).json({ message: 'Admin đã tồn tại!' })
    const hashedPassword = await bcrypt.hash(passWord, 10)
    const newAdmin = new Admin({ userName, passWord: hashedPassword })
    await newAdmin.save()
    res.status(200).json({ message: 'Tạo admin thành công!' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi đăng ký' })
  }
})

router.post('/login-admin', async (req, res) => {
  const { userName, passWord } = req.body
  try {
    const admin = await Admin.findOne({ userName })
    if (!admin || !(await bcrypt.compare(passWord, admin.passWord))) {
      return res.status(401).json({ message: 'Sai thông tin quản trị!' })
    }
    const token = jwt.sign({ id: admin._id, role: admin.role }, SECRET_KEY, { expiresIn: '1d' })
    const { passWord: _, ...adminData } = admin._doc
    res.status(200).json({ ...adminData, token })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi đăng nhập admin' })
  }
})

// ==========================================
// 6. NHÓM API THỐNG KÊ (DASHBOARD)
// ==========================================

router.get('/stats', isAdmin, async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const [totalUsers, newOrders, confirmedRes, revenueData] = await Promise.all([User.countDocuments(), Order.countDocuments({ status: 'pending' }), Reservation.countDocuments({ status: 'confirmed' }), Order.aggregate([{ $match: { status: 'confirmed', updatedAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }])])
    res.json({
      stats: {
        totalUsers,
        newOrders,
        reservations: confirmedRes,
        revenue: revenueData[0]?.total || 0,
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/notifications', isAdmin, async (req, res) => {
  try {
    const data = await Notification.find().sort({ createdAt: -1 }).limit(15)
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
