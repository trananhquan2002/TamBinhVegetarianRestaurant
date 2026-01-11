const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Product = require('../models/Product')
const Category = require('../models/Category')
const User = require('../models/User')
const Reservation = require('../models/Reservation')
const Feedback = require('../models/Feedback')
const Order = require('../models/Order')
const Notification = require('../models/Notification')
const Admin = require('../models/Admin')
const SECRET_KEY = process.env.JWT_SECRET

// ==========================================
// MIDDLEWARE PHÂN QUYỀN (AUTHORIZATION)
// ==========================================

// 1. Kiểm tra Token hợp lệ (Dành cho cả User và Admin)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] // Lấy token từ Bearer Token
  if (!token) return res.status(401).json({ message: 'Bạn chưa đăng nhập!' })

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' })
    req.user = decoded // Lưu thông tin id và role vào req
    next()
  })
}

// 2. Kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin') {
      next()
    } else {
      res.status(403).json({ message: 'Bạn không có quyền truy cập khu vực quản trị!' })
    }
  })
}

// ==========================================
// 1. NHÓM API ĐƠN HÀNG (ORDERS)
// ==========================================

// Tạo đơn hàng mới (Khách hàng)
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

// Lấy danh sách đơn hàng (Chỉ Admin mới được xem)
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

// Cập nhật trạng thái đơn hàng (Chỉ Admin)
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

// Lấy thông tin giao hàng gần nhất (User cần verifyToken)
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

// Lấy danh sách lịch đặt bàn (Chỉ Admin)
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

// Cập nhật trạng thái đặt bàn (Chỉ Admin)
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

// Xem feedback (Chỉ Admin)
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
  const menuItems = await Product.find()
  res.status(200).json({ data: menuItems })
})

router.get('/categories', async (req, res) => {
  const cats = await Category.find()
  res.status(200).json(cats)
})

// ==========================================
// 5. NHÓM API AUTH (USER & ADMIN)
// ==========================================

// Đăng ký tài khoản người dùng (Khách hàng)
router.post('/register', async (req, res) => {
  const { userName, passWord } = req.body
  try {
    const userExists = await User.findOne({ userName })
    if (userExists) {
      return res.status(400).json({ message: 'Tên đăng nhập này đã được đăng ký!' })
    }
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(passWord, saltRounds)
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

// Đăng nhập User
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

// Đăng ký Admin
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

// Đăng nhập Admin (Trả về Token)
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

// Chỉ Admin mới được xem thống kê và thông báo
router.get('/stats', isAdmin, async (req, res) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [totalUsers, newOrders, confirmedRes, revenueData] = await Promise.all([User.countDocuments(), Order.countDocuments({ status: 'pending' }), Reservation.countDocuments({ status: 'confirmed' }), Order.aggregate([{ $match: { status: 'confirmed', updatedAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }])])
  res.json({ stats: { totalUsers, newOrders, reservations: confirmedRes, revenue: revenueData[0]?.total || 0 } })
})

router.get('/notifications', isAdmin, async (req, res) => {
  const data = await Notification.find().sort({ createdAt: -1 }).limit(15)
  res.status(200).json(data)
})

module.exports = router
