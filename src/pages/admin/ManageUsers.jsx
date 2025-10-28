import React, { useMemo, useState } from 'react';

const mockUsers = [
  {
    id: 'U001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901 234 567',
    role: 'customer',
    status: 'active',
    totalOrders: 12,
    lastOrder: '22/10/2025',
    lastLogin: '26/10/2025 21:15'
  },
  {
    id: 'U002',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0909 888 777',
    role: 'customer',
    status: 'pending',
    totalOrders: 1,
    lastOrder: '18/10/2025',
    lastLogin: '18/10/2025 14:04'
  },
  {
    id: 'U003',
    name: 'Phạm Minh C',
    email: 'phamminhc@example.com',
    phone: '0912 456 789',
    role: 'staff',
    status: 'active',
    totalOrders: 0,
    lastOrder: '—',
    lastLogin: '27/10/2025 08:45'
  },
  {
    id: 'U004',
    name: 'Lê Hồng D',
    email: 'lehond@example.com',
    phone: '0981 222 333',
    role: 'customer',
    status: 'suspended',
    totalOrders: 5,
    lastOrder: '05/09/2025',
    lastLogin: '07/09/2025 19:22'
  },
  {
    id: 'U005',
    name: 'Admin Nội Bộ',
    email: 'admin@example.com',
    phone: '0903 111 222',
    role: 'admin',
    status: 'active',
    totalOrders: 0,
    lastOrder: '—',
    lastLogin: '28/10/2025 07:30'
  }
];

const roleLabels = {
  customer: 'Khách hàng',
  staff: 'Nhân viên',
  admin: 'Quản trị viên'
};

const statusLabels = {
  active: 'Hoạt động',
  pending: 'Chờ xác minh',
  suspended: 'Tạm khóa'
};

const statusVariant = {
  active: 'success',
  pending: 'warning',
  suspended: 'secondary'
};

const ManageUsers = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter((user) => user.status === 'active').length;
  const staffUsers = mockUsers.filter((user) => user.role !== 'customer').length;

  // Filter mock users by search term, role, and status selections.
  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return mockUsers.filter((user) => {
      const matchesSearch = normalizedSearch.length === 0
        || [user.name, user.email, user.phone].some((field) => field.toLowerCase().includes(normalizedSearch));
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, search, statusFilter]);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-0">Quản lý người dùng</h3>
          <small className="text-muted">Theo dõi tài khoản khách hàng và nhân viên (dữ liệu demo).</small>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <input
            type="search"
            className="form-control"
            placeholder="Tìm theo tên, email, số điện thoại..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ minWidth: 240 }}
          />
          <select
            className="form-select"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="customer">Khách hàng</option>
            <option value="staff">Nhân viên</option>
            <option value="admin">Quản trị viên</option>
          </select>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="pending">Chờ xác minh</option>
            <option value="suspended">Tạm khóa</option>
          </select>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Tổng tài khoản</p>
              <h4 className="mb-0">{totalUsers}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Đang hoạt động</p>
              <h4 className="mb-0">{activeUsers}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Nhân sự nội bộ</p>
              <h4 className="mb-0">{staffUsers}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã người dùng</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Đơn đã đặt</th>
                <th>Đơn gần nhất</th>
                <th>Trạng thái</th>
                <th>Lần đăng nhập cuối</th>
                <th style={{ width: 200 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-muted">Chưa có người dùng phù hợp với bộ lọc.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="fw-semibold">{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{roleLabels[user.role]}</td>
                    <td>{user.totalOrders}</td>
                    <td>{user.lastOrder}</td>
                    <td>
                      <span className={`badge bg-${statusVariant[user.status] || 'secondary'}`}>
                        {statusLabels[user.status] || user.status}
                      </span>
                    </td>
                    <td><small>{user.lastLogin}</small></td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button type="button" className="btn btn-outline-primary" disabled>Xem chi tiết</button>
                        <button type="button" className="btn btn-outline-warning" disabled>Đặt lại mật khẩu</button>
                        <button type="button" className="btn btn-outline-danger" disabled>{user.status === 'suspended' ? 'Mở khóa' : 'Khóa tài khoản'}</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
