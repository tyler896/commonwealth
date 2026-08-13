import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CartProvider } from './cart/CartContext'
import { Layout } from './components/Layout'
import { STOREFRONT_UNLOCKED } from './config'
import { LanderPage } from './pages/LanderPage'
import { ShopPage } from './pages/ShopPage'
import { ProductPage } from './pages/ProductPage'
import { CollectionPage } from './pages/CollectionPage'
import { CheckoutPage } from './pages/CheckoutPage'

export default function App() {
  if (!STOREFRONT_UNLOCKED) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LanderPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
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
