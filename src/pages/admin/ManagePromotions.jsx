import React, { useMemo, useState } from 'react';

const initialPromotions = [
  {
    code: 'PIZZA50',
    title: 'Giảm 50% cho đơn đầu tiên',
    discountType: 'percent',
    value: 50,
    minOrder: 300000,
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    usage: 120,
    status: 'Đang áp dụng',
  },
  {
    code: 'FREESHIP',
    title: 'Miễn phí vận chuyển cuối tuần',
    discountType: 'amount',
    value: 30000,
    minOrder: 200000,
    startDate: '2025-10-15',
    endDate: '2025-12-31',
    usage: 87,
    status: 'Đang áp dụng',
  },
  {
    code: 'WELCOME20',
    title: 'Giảm 20k cho khách hàng mới',
    discountType: 'amount',
    value: 20000,
    minOrder: 150000,
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    usage: 240,
    status: 'Đã hết hạn',
  }
];

const statusVariant = {
  'Đang áp dụng': 'success',
  'Chưa kích hoạt': 'secondary',
  'Đã hết hạn': 'warning',
};

const ManagePromotions = () => {
  const [promotions] = useState(initialPromotions);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promo) => {
      const matchQuery = [promo.code, promo.title]
        .some((field) => field.toLowerCase().includes(query.toLowerCase()));
      const matchStatus = statusFilter === 'all' || promo.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [promotions, query, statusFilter]);

  const formatDiscount = (promo) => {
    if (promo.discountType === 'percent') return `${promo.value}%`;
    return `${promo.value.toLocaleString()} đ`;
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-0">Chương trình khuyến mãi</h3>
          <small className="text-muted">Quản lý mã giảm giá và ưu đãi (dữ liệu demo).</small>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <input
            type="search"
            className="form-control"
            placeholder="Tìm theo mã hoặc tên chương trình..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ minWidth: 240 }}
          />
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="Đang áp dụng">Đang áp dụng</option>
            <option value="Chưa kích hoạt">Chưa kích hoạt</option>
            <option value="Đã hết hạn">Đã hết hạn</option>
          </select>
          <button className="btn btn-dark" disabled>+ Tạo khuyến mãi (demo)</button>
        </div>
      </div>
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã</th>
                <th>Tên chương trình</th>
                <th>Giá trị</th>
                <th>Đơn tối thiểu</th>
                <th>Thời gian</th>
                <th>Lượt sử dụng</th>
                <th>Trạng thái</th>
                <th style={{ width: 160 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromotions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-muted">Không tìm thấy khuyến mãi phù hợp.</td>
                </tr>
              ) : (
                filteredPromotions.map((promo) => (
                  <tr key={promo.code}>
                    <td className="fw-semibold">{promo.code}</td>
                    <td>{promo.title}</td>
                    <td>{formatDiscount(promo)}</td>
                    <td>{promo.minOrder.toLocaleString()} đ</td>
                    <td>
                      <small className="text-muted">
                        {promo.startDate} → {promo.endDate}
                      </small>
                    </td>
                    <td>{promo.usage}</td>
                    <td>
                      <span className={`badge bg-${statusVariant[promo.status] || 'secondary'}`}>{promo.status}</span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary" disabled>Chỉnh sửa</button>
                        <button className="btn btn-outline-danger" disabled>Ngừng kích hoạt</button>
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

export default ManagePromotions;
