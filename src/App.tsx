import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CartProvider } from './cart/CartContext'
import { AuthProvider } from './auth/AuthContext'
import { Layout } from './components/Layout'
import {
  STOREFRONT_ENV_UNLOCKED,
  isPreviewUnlocked,
} from './config'
import { AdminPage } from './pages/AdminPage'
import { SpreeAdminRedirect } from './pages/SpreeAdminRedirect'
import { LanderPage } from './pages/LanderPage'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ProductPage } from './pages/ProductPage'
import { CollectionPage } from './pages/CollectionPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { AboutPage } from './pages/AboutPage'
import { WholesaleApplyPage } from './pages/WholesaleApplyPage'
import { WholesaleLoginPage } from './pages/WholesaleLoginPage'
import { EventsPage } from './pages/EventsPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { FaqPage } from './pages/FaqPage'

export default function App() {
  const [unlocked, setUnlocked] = useState(
    () => STOREFRONT_ENV_UNLOCKED || isPreviewUnlocked(),
  )

  useEffect(() => {
    const sync = () => setUnlocked(STOREFRONT_ENV_UNLOCKED || isPreviewUnlocked())
    window.addEventListener('cw-preview-unlock', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('cw-preview-unlock', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  if (!unlocked) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LanderPage />} />
          <Route path="/catalog-admin/*" element={<AdminPage />} />
          <Route path="/admin/*" element={<SpreeAdminRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/catalog-admin/*" element={<AdminPage />} />
            <Route path="/admin/*" element={<SpreeAdminRedirect />} />
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="shop/:id" element={<ProductPage />} />
              <Route path="collections/:slug" element={<CollectionPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:slug" element={<EventDetailPage />} />
              <Route path="wholesale" element={<WholesaleApplyPage />} />
              <Route path="wholesale/login" element={<WholesaleLoginPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
