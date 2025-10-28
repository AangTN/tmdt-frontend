import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../../services/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchCategories().catch(() => []);
        if (!mounted) return;
        setCategories(Array.isArray(res) ? res : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Quản lý danh mục</h3>
        <button className="btn btn-dark" disabled>+ Thêm danh mục (demo)</button>
      </div>
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: 80 }}>#</th>
                <th>Tên danh mục</th>
                <th style={{ width: 160 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">Đang tải...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted">Chưa có danh mục.</td>
                </tr>
              ) : (
                categories.map((cat, idx) => (
                  <tr key={cat.MaDanhMuc}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{cat.TenDanhMuc}</td>
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
  );
};

export default ManageCategories;
