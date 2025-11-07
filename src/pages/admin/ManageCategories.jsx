import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../../services/api';
import styles from '../../styles/admin/AdminTable.module.css';
import buttonStyles from '../../styles/admin/AdminButton.module.css';
import cardStyles from '../../styles/admin/AdminCard.module.css';

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
    <div className="admin-animate-fade-in">
      {/* Header Section */}
      <div className={`${cardStyles.cardPremium} mb-4`}>
        <div className={cardStyles.cardHeaderPremium}>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <h2 className={`${cardStyles.cardTitleLarge} mb-2`}>Quản lý danh mục</h2>
              <p className={cardStyles.cardSubtitle}>Tổng số: {categories.length} danh mục</p>
            </div>
            <button className={`${buttonStyles.button} ${buttonStyles.buttonPrimary} ${buttonStyles.buttonLarge}`}>
              <span>+</span> Thêm danh mục
            </button>
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
                    <span>Tên danh mục</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th style={{ width: 180 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-5">
                    <div className={styles.tableLoadingOverlay}>
                      <div className={styles.tableLoadingSpinner}></div>
                    </div>
                    <div className="mt-3">
                      <small className="text-muted">Đang tải dữ liệu...</small>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3}>
                    <div className={styles.tableEmpty}>
                      <div className={styles.tableEmptyIcon}>📁</div>
                      <div className={styles.tableEmptyTitle}>Chưa có danh mục</div>
                      <div className={styles.tableEmptyDescription}>
                        Bắt đầu thêm danh mục đầu tiên để quản lý sản phẩm của bạn
                      </div>
                      <button className={`${buttonStyles.button} ${buttonStyles.buttonOutline}`}>
                        Thêm danh mục mới
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat, idx) => (
                  <tr key={cat.MaDanhMuc} className="admin-animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
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
                            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)'
                          }}
                        >
                          <span style={{ fontSize: 18 }}>📁</span>
                        </div>
                        <div>
                          <div className={styles.tableCellBold}>{cat.TenDanhMuc}</div>
                          <small className={styles.tableCellMuted}>Mã: {cat.MaDanhMuc}</small>
                        </div>
                      </div>
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
        {!loading && categories.length > 0 && (
          <div className={styles.tablePagination}>
            <div className={styles.tablePaginationInfo}>
              Hiển thị {categories.length} danh mục
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

export default ManageCategories;
