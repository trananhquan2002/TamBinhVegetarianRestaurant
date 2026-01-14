import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './pages/admin/context/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import { GoogleOAuthProvider } from '@react-oauth/google'
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
import App from './App.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
    <ScrollToTop />
    <AuthProvider>
      <CartProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)
