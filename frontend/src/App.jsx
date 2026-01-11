import { AuthProvider } from './context/AuthContext'
import { Routes, Route, Outlet } from 'react-router-dom'
import ProtectedRoute from './pages/admin/context/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Logout from './pages/Logout'
import CartPage from './pages/CartPage'
import Register from './pages/Register'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccess from './pages/OrderSuccess'
import ReservationSuccess from './pages/ReservationSuccess'
import AdminLayout from './pages/admin/AdminLayout'
import AdminHome from './pages/admin/AdminHome'
import OrderManager from './pages/admin/OrderManager'
import ReservationManager from './pages/admin/ReservationManager'
import FeedbackManager from './pages/admin/FeedbackManager'
import LoginAdmin from './pages/admin/LoginAdmin'
import RegisterAdmin from './pages/admin/RegisterAdmin'
function CustomerLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="reservation-success" element={<ReservationSuccess />} />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route path="logout" element={<Logout />} />
        </Route>
        <Route
          path="admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
          <Route index element={<AdminHome />} />
          <Route path="orders" element={<OrderManager />} />
          <Route path="reservations" element={<ReservationManager />} />
          <Route path="feedback" element={<FeedbackManager />} />
        </Route>
        <Route path="admin/login" element={<LoginAdmin />} />
        <Route path="admin/register" element={<RegisterAdmin />} />
        <Route path="*" element={<div className="text-center py-20">Trang không tồn tại</div>} />
      </Routes>
    </AuthProvider>
  )
}
