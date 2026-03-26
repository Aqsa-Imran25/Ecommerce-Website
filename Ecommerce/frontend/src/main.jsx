import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './components/context/Cart.jsx'
import { UserAuthProvider } from './components/context/UserAuth.jsx'
import { AdminAuthProvider } from './components/context/AdminAuth.jsx'
import { VendorAuthProvider } from './components/context/VendorAuth.jsx'
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/fontawesome.min.css" integrity="sha512-M5Kq4YVQrjg5c2wsZSn27Dkfm/2ALfxmun0vUE3mPiJyK53hQBHYCVAtvMYEC7ZXmYLg8DVG4tF8gD27WmDbsg==" crossorigin="anonymous" referrerpolicy="no-referrer" />


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminAuthProvider>
      <VendorAuthProvider>
        <UserAuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </UserAuthProvider>
      </VendorAuthProvider>
    </AdminAuthProvider>
  </StrictMode>,
)
