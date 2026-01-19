import express, { json, urlencoded } from 'express'
import { createServer } from 'http'
import cors from 'cors'
import { connect } from 'mongoose'
require('dotenv').config()
import apiRouter from './router/apiRouter.js'
const app = express()
const server = createServer(app)
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
connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err))
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)
app.use(json())
app.use(urlencoded({ extended: true }))
app.use('/api', apiRouter)
server.listen(port, () => {
  console.log(`🚀 Server đang chạy tại port ${port}`)
})
export default { app, io }
