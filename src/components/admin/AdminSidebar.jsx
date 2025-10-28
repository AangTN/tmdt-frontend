import React from 'react';
import { NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `list-group-item list-group-item-action d-flex align-items-center ${isActive ? 'active' : ''}`;

const AdminSidebar = () => (
  <aside className="bg-light border-end" style={{ minWidth: 240 }}>
    <div className="p-3 border-bottom">
      <h5 className="mb-0">Bảng điều khiển</h5>
      <small className="text-muted">Quản trị cửa hàng</small>
    </div>
    <div className="list-group list-group-flush">
      <NavLink end to="/admin" className={navLinkClass}>
        <span className="me-2">📊</span> Tổng quan
      </NavLink>
      <NavLink to="/admin/products" className={navLinkClass}>
        <span className="me-2">🍕</span> Quản lý sản phẩm
      </NavLink>
      <NavLink to="/admin/categories" className={navLinkClass}>
        <span className="me-2">🏷️</span> Quản lý danh mục
      </NavLink>
      <NavLink to="/admin/types" className={navLinkClass}>
        <span className="me-2">📂</span> Quản lý thể loại
      </NavLink>
      <NavLink to="/admin/orders" className={navLinkClass}>
        <span className="me-2">🧾</span> Quản lý đơn hàng
      </NavLink>
      <NavLink to="/admin/users" className={navLinkClass}>
        <span className="me-2">👥</span> Quản lý người dùng
      </NavLink>
      <NavLink to="/admin/options" className={navLinkClass}>
        <span className="me-2">🧩</span> Quản lý tùy chọn
      </NavLink>
      <NavLink to="/admin/reviews" className={navLinkClass}>
        <span className="me-2">⭐</span> Đánh giá đơn hàng
      </NavLink>
      <NavLink to="/admin/promotions" className={navLinkClass}>
        <span className="me-2">🎁</span> Khuyến mãi
      </NavLink>
      <NavLink to="/admin/banners" className={navLinkClass}>
        <span className="me-2">🖼️</span> Banner quảng cáo
      </NavLink>
    </div>
  </aside>
);

export default AdminSidebar;
