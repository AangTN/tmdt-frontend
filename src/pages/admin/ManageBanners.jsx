import React, { useState } from 'react';

const initialBanners = [
  {
    id: 1,
    title: 'Pizza hải sản siêu topping',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    position: 'Trang chủ - Hero',
    status: 'Hiển thị',
    updatedAt: '2025-10-10 09:30',
  },
  {
    id: 2,
    title: 'Combo gia đình tiết kiệm',
    image: 'https://images.unsplash.com/photo-1587397845856-e6cf49176c70?auto=format&fit=crop&w=800&q=80',
    position: 'Trang chủ - Giữa trang',
    status: 'Hiển thị',
    updatedAt: '2025-10-05 14:12',
  },
  {
    id: 3,
    title: 'Ưu đãi 11/11',
    image: 'https://images.unsplash.com/photo-1548365328-9f547fe340b2?auto=format&fit=crop&w=800&q=80',
    position: 'Popup khuyến mãi',
    status: 'Ẩn',
    updatedAt: '2025-09-30 08:05',
  }
];

const ManageBanners = () => {
  const [banners] = useState(initialBanners);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-0">Quản lý banner quảng cáo</h3>
          <small className="text-muted">Quản lý hình ảnh, vị trí hiển thị (dữ liệu demo).</small>
        </div>
        <button className="btn btn-dark" disabled>+ Thêm banner (demo)</button>
      </div>
      <div className="row g-3">
        {banners.map((banner) => (
          <div className="col-12 col-md-6 col-xl-4" key={banner.id}>
            <div className="card h-100 shadow-sm">
              <div className="ratio ratio-16x9">
                <img src={banner.image} alt={banner.title} className="w-100 h-100 object-fit-cover" />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{banner.title}</h5>
                <p className="text-muted small mb-2">Vị trí: {banner.position}</p>
                <div className="mb-2">
                  <span className={`badge ${banner.status === 'Hiển thị' ? 'bg-success' : 'bg-secondary'}`}>
                    {banner.status}
                  </span>
                </div>
                <small className="text-muted">Cập nhật: {banner.updatedAt}</small>
                <div className="mt-3 d-flex gap-2">
                  <button className="btn btn-outline-secondary btn-sm flex-grow-1" disabled>Chỉnh sửa</button>
                  <button className="btn btn-outline-danger btn-sm" disabled>Xóa</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBanners;
