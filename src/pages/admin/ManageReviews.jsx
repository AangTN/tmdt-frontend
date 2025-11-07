import React, { useMemo, useState } from 'react';
import styles from '../../styles/admin/AdminTable.module.css';
import buttonStyles from '../../styles/admin/AdminButton.module.css';
import formStyles from '../../styles/admin/AdminForm.module.css';
import cardStyles from '../../styles/admin/AdminCard.module.css';

const mockReviews = [
  {
    id: 'RV001',
    orderId: 'DH1001',
    customer: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Pizza ngon, giao hàng nhanh!'
  },
  {
    id: 'RV002',
    orderId: 'DH0999',
    customer: 'Lê Minh C',
    rating: 4,
    comment: 'Ngon nhưng hơi nguội tí, shipper thân thiện.'
  },
  {
    id: 'RV003',
    orderId: 'DH0995',
    customer: 'Trần Thị B',
    rating: 2,
    comment: 'Giao chậm 15 phút, mong cải thiện.'
  }
];

const ManageReviews = () => {
  const [ratingFilter, setRatingFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredReviews = useMemo(() => {
    return mockReviews.filter((review) => {
      const matchRating = ratingFilter === 'all' || review.rating === Number(ratingFilter);
      const matchText = [review.customer, review.orderId, review.comment]
        .some((field) => field.toLowerCase().includes(search.toLowerCase()));
      return matchRating && matchText;
    });
  }, [ratingFilter, search]);

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#faad14' : '#d9d9d9', fontSize: '16px' }}>
          {i <= rating ? '⭐' : '☆'}
        </span>
      );
    }
    return stars;
  };

  const getRatingVariant = (rating) => {
    if (rating === 5) return 'Active';
    if (rating === 4) return 'Active';
    if (rating === 3) return 'Pending';
    return 'Error';
  };

  return (
    <div className="admin-animate-fade-in">
      {/* Header Section */}
      <div className={`${cardStyles.cardPremium} mb-4`}>
        <div className={cardStyles.cardHeaderPremium}>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <h2 className={`${cardStyles.cardTitleLarge} mb-2`}>Đánh giá đơn hàng</h2>
              <p className={cardStyles.cardSubtitle}>Theo dõi phản hồi của khách hàng</p>
            </div>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <div className={formStyles.formSearch}>
                <span className={formStyles.formSearchIcon}>🔍</span>
                <input
                  type="search"
                  className={`${formStyles.formInput} ${formStyles.formSearchInput}`}
                  placeholder="Tìm theo khách hàng, mã đơn hoặc nội dung..."
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
              <div className={formStyles.formFilter}>
                <select
                  className={formStyles.formSelect}
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="all">Tất cả sao</option>
                  <option value="5">5 sao</option>
                  <option value="4">4 sao</option>
                  <option value="3">3 sao</option>
                  <option value="2">2 sao</option>
                  <option value="1">1 sao</option>
                </select>
              </div>
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
                    <span>Mã đánh giá</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th style={{ width: 120 }}>
                  <div className={styles.tableSortable}>
                    <span>Mã đơn</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th>
                  <div className={styles.tableSortable}>
                    <span>Khách hàng</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th style={{ width: 120 }}>
                  <div className={styles.tableSortable}>
                    <span>Số sao</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th>
                  <div className={styles.tableSortable}>
                    <span>Nhận xét</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th style={{ width: 160 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.tableEmpty}>
                      <div className={styles.tableEmptyIcon}>⭐</div>
                      <div className={styles.tableEmptyTitle}>Chưa có đánh giá phù hợp</div>
                      <div className={styles.tableEmptyDescription}>
                        {search || ratingFilter !== 'all' 
                          ? 'Thử thay đổi bộ lọc tìm kiếm' 
                          : 'Chưa có đánh giá nào từ khách hàng'}
                      </div>
                      <button 
                        className={`${buttonStyles.button} ${buttonStyles.buttonOutline}`}
                        onClick={() => {
                          setSearch('');
                          setRatingFilter('all');
                        }}
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review, index) => (
                  <tr key={review.id} className="admin-animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td className={styles.tableCellBold}>
                      <span className={`${styles.tableBadge} ${styles.tableBadgeInfo}`}>
                        {review.id}
                      </span>
                    </td>
                    <td>
                      <div className={styles.tableCellMuted}>
                        🧾 {review.orderId}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ 
                            width: 36, 
                            height: 36,
                            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                            color: 'white',
                            fontSize: 14,
                            fontWeight: 'bold'
                          }}
                        >
                          {review.customer.charAt(0)}
                        </div>
                        <div>
                          <div className={styles.tableCellBold}>{review.customer}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="d-flex">
                          {getRatingStars(review.rating)}
                        </div>
                        <span className={`${styles.tableBadge} ${styles[`tableBadge${getRatingVariant(review.rating)}`]}`}>
                          {review.rating}/5
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={`${styles.tableCellMuted} text-truncate`} style={{ maxWidth: 300 }}>
                        {review.comment}
                      </div>
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <button 
                          className={`${styles.tableAction} ${styles.tableActionSuccess}`}
                          title="Trả lời"
                        >
                          💬
                        </button>
                        <button 
                          className={`${styles.tableAction} ${styles.tableActionDanger}`}
                          title="Ẩn đánh giá"
                        >
                          👁️‍🗨️
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
        {filteredReviews.length > 0 && (
          <div className={styles.tablePagination}>
            <div className={styles.tablePaginationInfo}>
              Hiển thị {filteredReviews.length} trên {mockReviews.length} đánh giá
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

export default ManageReviews;
