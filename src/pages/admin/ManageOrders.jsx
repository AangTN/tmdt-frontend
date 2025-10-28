import React, { useMemo, useState } from 'react';

const mockOrders = [
  {
    id: 'DH1001',
    customer: 'Nguyễn Văn A',
    phone: '0901234567',
    total: 550000,
    status: 'Đang xử lý',
    createdAt: '2025-10-20 18:30',
  },
  {
    id: 'DH1002',
    customer: 'Trần Thị B',
    phone: '0987654321',
    total: 325000,
    status: 'Đã giao',
    createdAt: '2025-10-19 12:15',
  },
  {
    id: 'DH1003',
    customer: 'Lê Minh C',
    phone: '0912345678',
    total: 720000,
    status: 'Đang giao',
    createdAt: '2025-10-18 09:45',
  },
];

const statusVariant = {
  'Đang xử lý': 'warning',
  'Đang giao': 'primary',
  'Đã giao': 'success',
  'Đã hủy': 'secondary',
};

const ManageOrders = () => {
  const [filter, setFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return mockOrders;
    return mockOrders.filter(order => order.status === filter);
  }, [filter]);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-0">Quản lý đơn hàng</h3>
          <small className="text-muted">Đây là dữ liệu minh họa.</small>
        </div>
        <div className="d-flex gap-2">
          <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Đã giao">Đã giao</option>
          </select>
          <button className="btn btn-outline-secondary" disabled>Xuất báo cáo</button>
        </div>
      </div>
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Số điện thoại</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
                <th style={{ width: 140 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="fw-semibold">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.phone}</td>
                  <td>{order.total.toLocaleString()} đ</td>
                  <td>
                    <span className={`badge bg-${statusVariant[order.status] || 'secondary'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td><small className="text-muted">{order.createdAt}</small></td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary" disabled>Chi tiết</button>
                      <button className="btn btn-outline-success" disabled>Cập nhật</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
