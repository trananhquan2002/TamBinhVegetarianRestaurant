import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './pages/admin/context/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import { HelmetProvider } from 'react-helmet-async'
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
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
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </GoogleOAuthProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)
