import path from 'path'
import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import { Server } from 'socket.io'
import apiRouter from './router/apiRouter.js'
dotenv.config()
const app = express()
const server = createServer(app)
const port = process.env.PORT || 5000
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://tam-binh-vegetarian-restaurant.vercel.app', /\.vercel\.app$/],
    methods: ['GET', 'POST'],
    credentials: true,
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
    origin: ['http://localhost:5173', /\.vercel\.app$/],
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', apiRouter)
server.listen(port, () => {
  console.log(`🚀 Server đang chạy tại port ${port}`)
})
export { app, io }
