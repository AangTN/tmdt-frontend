import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import PaymentFailedPage from './pages/PaymentFailedPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import TrackOrderPage from './pages/TrackOrderPage.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import CombosPage from './pages/CombosPage.jsx';
import ComboDetailPage from './pages/ComboDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfileEditPage from './pages/ProfileEditPage.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageProducts from './pages/admin/ManageProducts.jsx';
import ManageCategories from './pages/admin/ManageCategories.jsx';
import ManageTypes from './pages/admin/ManageTypes.jsx';
import ManageOrders from './pages/admin/ManageOrders.jsx';
import ManageOptions from './pages/admin/ManageOptions.jsx';
import ManageReviews from './pages/admin/ManageReviews.jsx';
import ManagePromotions from './pages/admin/ManagePromotions.jsx';
import ManageBanners from './pages/admin/ManageBanners.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import RequireAdmin from './components/admin/RequireAdmin.jsx';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminRoute && <Header />}
      <main className={isAdminRoute ? 'bg-light' : ''}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/foods/:id" element={<ProductDetail />} />
          <Route path="/combos" element={<CombosPage />} />
          <Route path="/combos/:id" element={<ComboDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/payment-failed" element={<PaymentFailedPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={(
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            )}
          >
            <Route index element={
              <RequireAdmin requiredPermission="Tổng quan">
                <AdminDashboard />
              </RequireAdmin>
            } />
            <Route path="products" element={
              <RequireAdmin requiredPermission="Quản lý sản phẩm">
                <ManageProducts />
              </RequireAdmin>
            } />
            <Route path="categories" element={
              <RequireAdmin requiredPermission="Quản lý danh mục">
                <ManageCategories />
              </RequireAdmin>
            } />
            <Route path="types" element={
              <RequireAdmin requiredPermission="Quản lý thể loại">
                <ManageTypes />
              </RequireAdmin>
            } />
            <Route path="orders" element={
              <RequireAdmin requiredPermission="Quản lý đơn hàng">
                <ManageOrders />
              </RequireAdmin>
            } />
            <Route path="users" element={
              <RequireAdmin requiredPermission="Quản lý người dùng">
                <ManageUsers />
              </RequireAdmin>
            } />
            <Route path="options" element={
              <RequireAdmin requiredPermission="Quản lý tùy chọn">
                <ManageOptions />
              </RequireAdmin>
            } />
            <Route path="reviews" element={
              <RequireAdmin requiredPermission="Quản lý đánh giá đơn hàng">
                <ManageReviews />
              </RequireAdmin>
            } />
            <Route path="promotions" element={
              <RequireAdmin requiredPermission="Quản lý khuyến mãi">
                <ManagePromotions />
              </RequireAdmin>
            } />
            <Route path="banners" element={
              <RequireAdmin requiredPermission="Quản lý banner">
                <ManageBanners />
              </RequireAdmin>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;