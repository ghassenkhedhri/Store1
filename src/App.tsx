import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'
import { HomePage } from '@/pages/HomePage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { AdminOverview } from '@/pages/admin/AdminOverview'
import { AdminCopilot } from '@/pages/admin/AdminCopilot'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="copilot" element={<AdminCopilot />} />
            {/* Add other admin routes here */}
          </Route>

          {/* Store Routes */}
          <Route path="/*" element={
            <>
              <Header />
              <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="products/:slug" element={<ProductDetailPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    {/* Add other store routes here */}
                  </Routes>
                </div>
              </main>
              <Footer />
            </>
          } />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App