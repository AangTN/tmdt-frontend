import React, { useMemo, useState } from 'react';
import styles from '../../styles/admin/AdminTable.module.css';
import buttonStyles from '../../styles/admin/AdminButton.module.css';
import formStyles from '../../styles/admin/AdminForm.module.css';
import cardStyles from '../../styles/admin/AdminCard.module.css';

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
  'Đang áp dụng': 'Active',
  'Chưa kích hoạt': 'Pending',
  'Đã hết hạn': 'Error',
};

const statusIcons = {
  'Đang áp dụng': '✅',
  'Chưa kích hoạt': '⏳',
  'Đã hết hạn': '❌',
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
    <div className="admin-animate-fade-in">
      {/* Header Section */}
      <div className={`${cardStyles.cardPremium} mb-4`}>
        <div className={cardStyles.cardHeaderPremium}>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <h2 className={`${cardStyles.cardTitleLarge} mb-2`}>Chương trình khuyến mãi</h2>
              <p className={cardStyles.cardSubtitle}>Quản lý mã giảm giá và ưu đãi</p>
            </div>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <div className={formStyles.formSearch}>
                <span className={formStyles.formSearchIcon}>🔍</span>
                <input
                  type="search"
                  className={`${formStyles.formInput} ${formStyles.formSearchInput}`}
                  placeholder="Tìm theo mã hoặc tên chương trình..."
                  style={{ minWidth: 280 }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    className={formStyles.formSearchClear}
                    onClick={() => setQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className={formStyles.formFilter}>
                <select
                  className={formStyles.formSelect}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Đang áp dụng">Đang áp dụng</option>
                  <option value="Chưa kích hoạt">Chưa kích hoạt</option>
                  <option value="Đã hết hạn">Đã hết hạn</option>
                </select>
              </div>
              <button className={`${buttonStyles.button} ${buttonStyles.buttonPrimary} ${buttonStyles.buttonLarge}`}>
                <span>+</span> Tạo khuyến mãi
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
                <th style={{ width: 120 }}>
                  <div className={styles.tableSortable}>
                    <span>Mã</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th>
                  <div className={styles.tableSortable}>
                    <span>Tên chương trình</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th style={{ width: 100 }}>
                  <div className={styles.tableSortable}>
                    <span>Giá trị</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th style={{ width: 120 }}>
                  <div className={styles.tableSortable}>
                    <span>Đơn tối thiểu</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th style={{ width: 180 }}>
                  <div className={styles.tableSortable}>
                    <span>Thời gian</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th style={{ width: 100 }}>
                  <div className={styles.tableSortable}>
                    <span>Lượt sử dụng</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th style={{ width: 120 }}>
                  <div className={styles.tableSortable}>
                    <span>Trạng thái</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th style={{ width: 180 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromotions.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className={styles.tableEmpty}>
                      <div className={styles.tableEmptyIcon}>🎁</div>
                      <div className={styles.tableEmptyTitle}>Không tìm thấy khuyến mãi</div>
                      <div className={styles.tableEmptyDescription}>
                        {query || statusFilter !== 'all' 
                          ? 'Thử thay đổi bộ lọc tìm kiếm' 
                          : 'Chưa có chương trình khuyến mãi nào'}
                      </div>
                      <button 
                        className={`${buttonStyles.button} ${buttonStyles.buttonOutline}`}
                        onClick={() => {
                          setQuery('');
                          setStatusFilter('all');
                        }}
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPromotions.map((promo, index) => (
                  <tr key={promo.code} className="admin-animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td className={styles.tableCellBold}>
                      <span className={`${styles.tableBadge} ${styles.tableBadgeInfo}`}>
                        {promo.code}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="rounded-2 bg-gradient d-flex align-items-center justify-content-center"
                          style={{ 
                            width: 40, 
                            height: 40,
                            background: 'linear-gradient(135deg, #ff4d4f 0%, #ff6b6b 100%)'
                          }}
                        >
                          <span style={{ fontSize: 18 }}>🎁</span>
                        </div>
                        <div>
                          <div className={styles.tableCellBold}>{promo.title}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`${styles.tableCellBold} ${styles.tableCellSuccess}`}>
                        {formatDiscount(promo)}
                      </div>
                    </td>
                    <td>
                      <div className={styles.tableCellMuted}>
                        {promo.minOrder.toLocaleString()} đ
                      </div>
                    </td>
                    <td>
                      <div className={styles.tableCellMuted}>
                        <small>{promo.startDate}</small>
                        <br />
                        <small>→ {promo.endDate}</small>
                      </div>
                    </td>
                    <td>
                      <div className={styles.tableCellBold}>
                        {promo.usage}
                      </div>
                      <small className={styles.tableCellMuted}>lượt</small>
                    </td>
                    <td>
                      <span className={`${styles.tableBadge} ${styles[`tableBadge${statusVariant[promo.status]}`]}`}>
                        <span className="me-1">{statusIcons[promo.status]}</span>
                        {promo.status}
                      </span>
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
                          className={`${promo.status === 'Đang áp dụng' ? styles.tableActionDanger : styles.tableActionWarning}`}
                          title={promo.status === 'Đang áp dụng' ? 'Ngừng kích hoạt' : 'Kích hoạt lại'}
                        >
                          {promo.status === 'Đang áp dụng' ? '⏸️' : '▶️️'}
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
        {filteredPromotions.length > 0 && (
          <div className={styles.tablePagination}>
            <div className={styles.tablePaginationInfo}>
              Hiển thị {filteredPromotions.length} trên {promotions.length} khuyến mãi
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

export default ManagePromotions;
