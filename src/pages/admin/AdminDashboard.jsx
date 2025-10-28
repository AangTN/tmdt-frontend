import React, { useEffect, useState } from 'react';
import { fetchFoods, fetchCategories, fetchTypes } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    foods: 0,
    categories: 0,
    types: 0,
    orders: 24, // số liệu giả lập
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [foodsRes, categoriesRes, typesRes] = await Promise.all([
          fetchFoods().catch(() => []),
          fetchCategories().catch(() => []),
          fetchTypes().catch(() => []),
        ]);
        if (!mounted) return;
        setStats((prev) => ({
          ...prev,
          foods: Array.isArray(foodsRes) ? foodsRes.length : 0,
          categories: Array.isArray(categoriesRes) ? categoriesRes.length : 0,
          types: Array.isArray(typesRes) ? typesRes.length : 0,
        }));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Tổng quan cửa hàng</h2>
        {loading && <span className="badge bg-secondary">Đang đồng bộ...</span>}
      </div>
      <div className="row g-3">
        {[{
          title: 'Sản phẩm', value: stats.foods, icon: '🍕', variant: 'primary'
        }, {
          title: 'Danh mục', value: stats.categories, icon: '🏷️', variant: 'success'
        }, {
          title: 'Thể loại', value: stats.types, icon: '📂', variant: 'info'
        }, {
          title: 'Đơn hàng chờ', value: stats.orders, icon: '🧾', variant: 'warning'
        }].map((card) => (
          <div className="col-12 col-sm-6 col-lg-3" key={card.title}>
            <div className={`card border-${card.variant} h-100`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted text-uppercase mb-1">{card.title}</h6>
                    <h3 className="fw-bold mb-0">{card.value}</h3>
                  </div>
                  <div style={{ fontSize: '2rem' }}>{card.icon}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Hoạt động gần đây</h5>
          <ul className="list-unstyled small mb-0">
            <li>• 2 đơn hàng mới vừa được tạo.</li>
            <li>• Menu đã cập nhật thêm 1 sản phẩm đặc biệt.</li>
            <li>• Danh mục "Pizza Hải Sản" được chỉnh sửa.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
