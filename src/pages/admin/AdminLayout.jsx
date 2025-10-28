import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <header className="bg-dark text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">Trang quản trị</h4>
          <small className="text-white-50">Quản lý cửa hàng pizza</small>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="text-end">
            <div className="fw-semibold">{admin?.username}</div>
            <small className="text-white-50">Quản trị viên</small>
          </div>
          <button className="btn btn-outline-light btn-sm" onClick={logout}>Đăng xuất</button>
        </div>
      </header>
      <div className="flex-grow-1 d-flex" style={{ minHeight: 0 }}>
        <AdminSidebar />
        <div className="flex-grow-1 p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
