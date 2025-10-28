import React, { useEffect, useMemo, useState } from 'react';
import { fetchFoods, fetchTypes, fetchCategories } from '../../services/api';

const ManageProducts = () => {
  const [foods, setFoods] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [foodsRes, typesRes, categoriesRes] = await Promise.all([
          fetchFoods().catch(() => []),
          fetchTypes().catch(() => []),
          fetchCategories().catch(() => []),
        ]);
        if (!mounted) return;
        setFoods(Array.isArray(foodsRes) ? foodsRes : []);
        setTypes(Array.isArray(typesRes) ? typesRes : []);
        setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const typeMap = useMemo(() => Object.fromEntries(types.map(t => [t.MaLoaiMonAn, t.TenLoaiMonAn])), [types]);

  const filteredFoods = foods.filter(food =>
    food.TenMonAn?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-0">Quản lý sản phẩm</h3>
          <small className="text-muted">Tổng số: {foods.length} món ăn</small>
        </div>
        <div className="d-flex gap-2">
          <input
            type="search"
            className="form-control"
            placeholder="Tìm sản phẩm..."
            style={{ minWidth: 220 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-dark" disabled>
            + Thêm sản phẩm (demo)
          </button>
        </div>
      </div>
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 70 }}>#</th>
                  <th>Tên món</th>
                  <th>Loại</th>
                  <th>Danh mục</th>
                  <th>Mô tả</th>
                  <th style={{ width: 140 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">Đang tải dữ liệu...</td>
                  </tr>
                ) : filteredFoods.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">Chưa có dữ liệu.</td>
                  </tr>
                ) : (
                  filteredFoods.map((food, index) => (
                    <tr key={food.MaMonAn}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="fw-semibold">{food.TenMonAn}</div>
                        <small className="text-muted">Mã: {food.MaMonAn}</small>
                      </td>
                      <td>{typeMap[food.MaLoaiMonAn] || '—'}</td>
                      <td>
                        {Array.isArray(food.DanhMuc) && food.DanhMuc.length > 0 ? (
                          <span className="badge bg-light text-dark border">
                            {food.DanhMuc.map(cat => cat.TenDanhMuc).join(', ')}
                          </span>
                        ) : '—'}
                      </td>
                      <td><small className="text-muted">{food.MoTa || 'Chưa cập nhật'}</small></td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-secondary" disabled>Sửa</button>
                          <button className="btn btn-outline-danger" disabled>Xóa</button>
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
    </div>
  );
};

export default ManageProducts;
