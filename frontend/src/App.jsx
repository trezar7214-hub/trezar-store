import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import WalletPayment from "./pages/WalletPayment";
import CardPayment from "./pages/CardPayment";
import OrderSuccess from "./pages/OrderSuccess";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

function StoreLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
          <Route path="/shop" element={<StoreLayout><Shop /></StoreLayout>} />
          <Route path="/product/:slug" element={<StoreLayout><ProductDetail /></StoreLayout>} />
          <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
          <Route path="/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
          <Route path="/pay/wallet/:orderNumber" element={<StoreLayout><WalletPayment /></StoreLayout>} />
          <Route path="/pay/card/:orderNumber" element={<StoreLayout><CardPayment /></StoreLayout>} />
          <Route path="/order-success/:orderNumber" element={<StoreLayout><OrderSuccess /></StoreLayout>} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
