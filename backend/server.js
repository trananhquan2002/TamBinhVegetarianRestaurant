const express = require('express')
const http = require('http')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const apiRouter = require('./router/apiRouter')
const app = express()
const server = http.createServer(app)
const port = process.env.PORT
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})
app.set('socketio', io)
io.on('connection', (socket) => {
  socket.on('join-reservation-room', (reservationId) => {
    socket.join(reservationId)
  })
  socket.on('confirmReservation', (data) => {
    const id = data._id || data.reservationId
    io.to(id).emit('reservation-status-updated', data)
    io.emit('update_stats')
  })
  socket.on('join-order-room', (orderId) => {
    socket.join(orderId)
  })
  socket.on('confirmOrder', (data) => {
    const id = data._id || data.orderId
    io.to(id).emit('order-status-updated', data)
    io.emit('update_stats')
  })
  socket.on('disconnect', () => {
    console.log('❌ Disconnected:', socket.id)
  })
})
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err))
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', apiRouter)
server.listen(port, () => {
  console.log(`🚀 Server đang chạy tại port ${port}`)
})
module.exports = { app, io }
