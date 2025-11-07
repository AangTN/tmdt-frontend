import React, { useEffect, useMemo, useState } from 'react';
import { fetchOptionPrices } from '../../services/api';
import styles from '../../styles/admin/AdminTable.module.css';
import buttonStyles from '../../styles/admin/AdminButton.module.css';
import formStyles from '../../styles/admin/AdminForm.module.css';
import cardStyles from '../../styles/admin/AdminCard.module.css';

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
    <div className="admin-animate-fade-in">
      {/* Header Section */}
      <div className={`${cardStyles.cardPremium} mb-4`}>
        <div className={cardStyles.cardHeaderPremium}>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <h2 className={`${cardStyles.cardTitleLarge} mb-2`}>Quản lý tùy chọn món</h2>
              <p className={cardStyles.cardSubtitle}>Hiển thị các tùy chọn thêm topping / nước sốt</p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <div className={formStyles.formSearch}>
                <span className={formStyles.formSearchIcon}>🔍</span>
                <input
                  type="search"
                  className={`${formStyles.formInput} ${formStyles.formSearchInput}`}
                  placeholder="Tìm tùy chọn hoặc nhóm..."
                  style={{ minWidth: 280 }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    className={formStyles.formSearchClear}
                    onClick={() => setSearch('')}
                  >
                    ✕
                  </button>
                )}
              </div>
              <button className={`${buttonStyles.button} ${buttonStyles.buttonPrimary} ${buttonStyles.buttonLarge}`}>
                <span>+</span> Thêm tùy chọn
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className={`${styles.tableContainerPremium} ${styles.tableAnimateIn}`}>
        <div className={styles.tableResponsive}>
          <table className={`${styles.table} ${styles.tableRowHover}`}>
            <thead className={styles.tableHeaderPrimary}>
              <tr>
                <th style={{ width: 80 }}>
                  <div className={styles.tableSortable}>
                    <span>#</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th>
                  <div className={styles.tableSortable}>
                    <span>Tên tùy chọn</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th>
                  <div className={styles.tableSortable}>
                    <span>Nhóm tùy chọn</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th>
                  <div className={styles.tableSortable}>
                    <span>Bảng giá thêm</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th style={{ width: 180 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    <div className={styles.tableLoadingOverlay}>
                      <div className={styles.tableLoadingSpinner}></div>
                    </div>
                    <div className="mt-3">
                      <small className="text-muted">Đang tải dữ liệu...</small>
                    </div>
                  </td>
                </tr>
              ) : filteredOptions.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className={styles.tableEmpty}>
                      <div className={styles.tableEmptyIcon}>🍽️</div>
                      <div className={styles.tableEmptyTitle}>Không có tùy chọn phù hợp</div>
                      <div className={styles.tableEmptyDescription}>
                        {search ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có tùy chọn nào được tạo'}
                      </div>
                      <button 
                        className={`${buttonStyles.button} ${buttonStyles.buttonOutline}`}
                        onClick={() => setSearch('')}
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOptions.map((opt, idx) => (
                  <tr key={opt.id} className="admin-animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <td className={styles.tableCellBold}>
                      <span className="badge bg-light text-dark border">
                        {idx + 1}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="rounded-2 bg-gradient d-flex align-items-center justify-content-center"
                          style={{ 
                            width: 40, 
                            height: 40,
                            background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)'
                          }}
                        >
                          <span style={{ fontSize: 18 }}>🍽️</span>
                        </div>
                        <div>
                          <div className={styles.tableCellBold}>{opt.name}</div>
                          <small className={styles.tableCellMuted}>Mã: {opt.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.tableBadge} ${styles.tableBadgeInfo}`}>
                        {opt.group}
                      </span>
                    </td>
                    <td>
                      {opt.prices.length === 0 ? (
                        <span className={styles.tableCellMuted}>Không có phụ phí</span>
                      ) : (
                        <div className="d-flex flex-wrap gap-1">
                          {opt.prices.map(price => (
                            <span 
                              key={price.sizeId || price.sizeName} 
                              className={`${styles.tableBadge} ${styles.tableBadgeActive}`}
                            >
                              {price.sizeName}: +{price.extra.toLocaleString()}đ
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <button 
                          className={`${styles.tableAction} ${styles.tableActionSuccess}`}
                          title="Chỉnh sửa"
                        >
                          ✏️
                        </button>
                        <button 
                          className={`${styles.tableAction} ${styles.tableActionDanger}`}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer with Pagination */}
        {!loading && filteredOptions.length > 0 && (
          <div className={styles.tablePagination}>
            <div className={styles.tablePaginationInfo}>
              Hiển thị {filteredOptions.length} trên {groupedOptions.length} tùy chọn
            </div>
            <div className={styles.tablePaginationControls}>
              <button 
                className={`${buttonStyles.button} ${buttonStyles.buttonOutline} ${buttonStyles.buttonSmall}`}
                disabled
              >
                ←
              </button>
              <span className="px-3 py-1">
                <strong>1</strong> / 1
              </span>
              <button 
                className={`${buttonStyles.button} ${buttonStyles.buttonOutline} ${buttonStyles.buttonSmall}`}
                disabled
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOptions;
