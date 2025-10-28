import React, { useEffect, useState } from 'react';
import { fetchTypes } from '../../services/api';

const ManageTypes = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchTypes().catch(() => []);
        if (!mounted) return;
        setTypes(Array.isArray(res) ? res : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Quản lý thể loại món</h3>
        <button className="btn btn-dark" disabled>+ Thêm thể loại (demo)</button>
      </div>
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: 80 }}>#</th>
                <th>Tên thể loại</th>
                <th style={{ width: 160 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">Đang tải...</td>
                </tr>
              ) : types.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted">Chưa có dữ liệu.</td>
                </tr>
              ) : (
                types.map((type, idx) => (
                  <tr key={type.MaLoaiMonAn}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{type.TenLoaiMonAn}</td>
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

export default ManageTypes;
