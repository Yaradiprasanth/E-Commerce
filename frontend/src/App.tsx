import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { CartPage } from "./pages/CartPage";
import { OrdersPage } from "./pages/OrdersPage";
import { AdminPage } from "./pages/AdminPage";
import { DealsPage } from "./pages/DealsPage";
import { BestSellersPage } from "./pages/BestSellersPage";
import { CategoryPage } from "./pages/CategoryPage";
import { PaymentMethodPage } from "./pages/PaymentMethodPage";
import { DeliveryAddressPage } from "./pages/DeliveryAddressPage";
import { PlaceOrderPage } from "./pages/PlaceOrderPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { useAuth } from "./context/AuthContext";
import { Footer } from "./components/Footer";

function App() {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/best-sellers" element={<BestSellersPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/delivery-address" element={<DeliveryAddressPage />} />
        <Route path="/payment-method" element={<PaymentMethodPage />} />
        <Route path="/place-order" element={<PlaceOrderPage />} />
        <Route path="/orders" element={user ? <OrdersPage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.isAdmin ? <AdminPage /> : <Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
