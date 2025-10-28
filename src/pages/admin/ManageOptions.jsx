import React, { useEffect, useMemo, useState } from 'react';
import { fetchOptionPrices } from '../../services/api';

const ManageOptions = () => {
  const [optionPrices, setOptionPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchOptionPrices().catch(() => []);
        if (!mounted) return;
        setOptionPrices(Array.isArray(res) ? res : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const groupedOptions = useMemo(() => {
    const map = new Map();
    optionPrices.forEach((item) => {
      const option = item?.TuyChon;
      if (!option) return;
      const key = option.MaTuyChon;
      if (!map.has(key)) {
        map.set(key, {
          id: option.MaTuyChon,
          name: option.TenTuyChon,
          group: option.LoaiTuyChon?.TenLoaiTuyChon || 'Chưa phân loại',
          prices: [],
        });
      }
      const record = map.get(key);
      record.prices.push({
        sizeId: item.MaSize,
        sizeName: item.Size?.TenSize || 'Không theo size',
        extra: Number(item.GiaThem || 0),
      });
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [optionPrices]);

  const filteredOptions = groupedOptions.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase()) ||
    opt.group.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-0">Quản lý tùy chọn món</h3>
          <small className="text-muted">Hiển thị các tùy chọn thêm topping / nước sốt.</small>
        </div>
        <div className="d-flex gap-2">
          <input
            type="search"
            className="form-control"
            placeholder="Tìm tùy chọn hoặc nhóm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 260 }}
          />
          <button className="btn btn-dark" disabled>+ Thêm tùy chọn (demo)</button>
        </div>
      </div>
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: 80 }}>#</th>
                <th>Tên tùy chọn</th>
                <th>Nhóm tùy chọn</th>
                <th>Bảng giá thêm</th>
                <th style={{ width: 160 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredOptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">Không có tùy chọn phù hợp.</td>
                </tr>
              ) : (
                filteredOptions.map((opt, idx) => (
                  <tr key={opt.id}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{opt.name}</td>
                    <td>
                      <span className="badge bg-light text-dark border">{opt.group}</span>
                    </td>
                    <td>
                      {opt.prices.length === 0 ? (
                        <span className="text-muted">Không có phụ phí</span>
                      ) : (
                        <div className="d-flex flex-wrap gap-2">
                          {opt.prices.map(price => (
                            <span key={price.sizeId || price.sizeName} className="badge bg-secondary">
                              {price.sizeName}: +{price.extra.toLocaleString()} đ
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
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

export default ManageOptions;
