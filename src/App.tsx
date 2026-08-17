import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CartProvider } from './cart/CartContext'
import { Layout } from './components/Layout'
import {
  STOREFRONT_ENV_UNLOCKED,
  isPreviewUnlocked,
} from './config'
import { AdminPage } from './pages/AdminPage'
import { LanderPage } from './pages/LanderPage'
import { ShopPage } from './pages/ShopPage'
import { ProductPage } from './pages/ProductPage'
import { CollectionPage } from './pages/CollectionPage'
import { CheckoutPage } from './pages/CheckoutPage'

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
          {/* Keep /admin reachable while the lander lock is on */}
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/shop" replace />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="shop/:id" element={<ProductPage />} />
            <Route path="collections/:slug" element={<CollectionPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="*" element={<Navigate to="/shop" replace />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
