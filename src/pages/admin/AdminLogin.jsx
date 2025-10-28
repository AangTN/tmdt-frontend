import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, adminCredentials } = useAdminAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const from = location.state?.from || '/admin';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    const result = login(form);
    if (!result.success) {
      setError(result.message || 'Không thể đăng nhập.');
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card shadow" style={{ maxWidth: 420, width: '100%' }}>
        <div className="card-body p-4">
          <h3 className="mb-3 text-center">Đăng nhập quản trị</h3>
          <p className="text-muted small text-center mb-4">
            {adminCredentials ? 'Nhập tài khoản đã đăng ký để vào bảng điều khiển.' : 'Lần đầu đăng nhập sẽ tự động tạo tài khoản quản trị.'}
          </p>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label htmlFor="username" className="form-label">Tài khoản</label>
              <input
                id="username"
                name="username"
                type="text"
                className="form-control"
                value={form.username}
                onChange={handleChange}
                placeholder="Nhập tài khoản quản trị"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="form-label">Mật khẩu</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            <button type="submit" className="btn btn-dark w-100">Đăng nhập</button>
          </form>
          <div className="text-center text-muted small mt-3">
            Tài khoản quản trị lưu cục bộ (khác với tài khoản khách hàng).
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
