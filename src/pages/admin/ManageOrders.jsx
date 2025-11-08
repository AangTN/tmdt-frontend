import React, { useMemo, useState } from 'react';
import styles from '../../styles/admin/AdminTable.module.css';
import buttonStyles from '../../styles/admin/AdminButton.module.css';
import formStyles from '../../styles/admin/AdminForm.module.css';
import cardStyles from '../../styles/admin/AdminCard.module.css';
import statsStyles from '../../styles/admin/AdminStats.module.css';
import { AdminResponsiveContainer } from '../../components/admin/AdminResponsiveContainer';
import { BusinessCard } from '../../components/admin/AdminTableCard';

const mockOrders = [
  {
    id: 'DH1001',
    customer: 'Nguyễn Văn A',
    phone: '0901234567',
    total: 550000,
    status: 'Đang xử lý',
    createdAt: '2025-10-20 18:30',
  },
  {
    id: 'DH1002',
    customer: 'Trần Thị B',
    phone: '0987654321',
    total: 325000,
    status: 'Đã giao',
    createdAt: '2025-10-19 12:15',
  },
  {
    id: 'DH1003',
    customer: 'Lê Minh C',
    phone: '0912345678',
    total: 720000,
    status: 'Đang giao',
    createdAt: '2025-10-18 09:45',
  },
  {
    id: 'DH1004',
    customer: 'Phạm Thị D',
    phone: '0934567890',
    total: 185000,
    status: 'Đã hủy',
    createdAt: '2025-10-17 15:20',
  },
  {
    id: 'DH1005',
    customer: 'Hoàng Văn E',
    phone: '0956789012',
    total: 920000,
    status: 'Đang xử lý',
    createdAt: '2025-10-16 20:10',
  },
];

const statusVariant = {
  'Đang xử lý': 'warning',
  'Đang giao': 'primary',
  'Đã giao': 'success',
  'Đã hủy': 'secondary',
};

const statusIcons = {
  'Đang xử lý': '⏳',
  'Đang giao': '🚚',
  'Đã giao': '✅',
  'Đã hủy': '❌',
};

const ManageOrders = () => {
  const [filter, setFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return mockOrders;
    return mockOrders.filter(order => order.status === filter);
  }, [filter]);

  const stats = useMemo(() => {
    const total = mockOrders.length;
    const processing = mockOrders.filter(o => o.status === 'Đang xử lý').length;
    const delivering = mockOrders.filter(o => o.status === 'Đang giao').length;
    const completed = mockOrders.filter(o => o.status === 'Đã giao').length;
    const cancelled = mockOrders.filter(o => o.status === 'Đã hủy').length;
    const totalRevenue = mockOrders
      .filter(o => o.status === 'Đã giao')
      .reduce((sum, o) => sum + o.total, 0);

    return { total, processing, delivering, completed, cancelled, totalRevenue };
  }, []);

  // Action handlers
  const handleView = (orderId) => {
    console.log('View order details:', orderId);
    // TODO: Implement view functionality
  };

  const handleEdit = (orderId) => {
    console.log('Edit order:', orderId);
    // TODO: Implement edit functionality
  };

  const handleCancel = (orderId) => {
    console.log('Cancel order:', orderId);
    // TODO: Implement cancel functionality
  };

  // Card component for responsive view
  const cardComponent = (
    <div className={styles.adminTableCards}>
      {filteredOrders.map((order, index) => (
        <BusinessCard
          key={order.id}
          data={order}
          type="order"
          onView={() => handleView(order.id)}
          onEdit={() => handleEdit(order.id)}
          onCancel={() => handleCancel(order.id)}
          index={index}
          animate={true}
          showTimeline={true}
        />
      ))}
    </div>
  );

  return (
    <div className="admin-animate-fade-in">
      {/* Stats Cards */}
      <div className={`${statsStyles.statsGrid4} mb-4`}>
        <div className={`${statsStyles.statCardPremium} ${statsStyles.statAnimateHover}`}>
          <div className={statsStyles.statHeader}>
            <h3 className={statsStyles.statTitle}>Tổng đơn hàng</h3>
            <div className={`${statsStyles.statIcon} ${statsStyles.statIconPrimary}`}>
              📋
            </div>
          </div>
          <div className={statsStyles.statContent}>
            <div className={statsStyles.statValue}>{stats.total}</div>
            <div className={statsStyles.statLabel}>Đơn hàng</div>
          </div>
          <div className={statsStyles.statFooter}>
            <div className={`${statsStyles.statChange} ${statsStyles.statChangePositive}`}>
              <span className={statsStyles.statChangeIcon}>↑</span>
              <span>12% so với tháng trước</span>
            </div>
            <div className={statsStyles.statPeriod}>Tháng 10</div>
          </div>
        </div>

        <div className={`${statsStyles.statCardPremium} ${statsStyles.statAnimateHover}`}>
          <div className={statsStyles.statHeader}>
            <h3 className={statsStyles.statTitle}>Đang xử lý</h3>
            <div className={`${statsStyles.statIcon} ${statsStyles.statIconWarning}`}>
              ⏳
            </div>
          </div>
          <div className={statsStyles.statContent}>
            <div className={statsStyles.statValue}>{stats.processing}</div>
            <div className={statsStyles.statLabel}>Chờ xác nhận</div>
          </div>
          <div className={statsStyles.statFooter}>
            <div className={statsStyles.statProgress}>
              <div className={statsStyles.statProgressBar}>
                <div 
                  className={`${statsStyles.statProgressFill} ${statsStyles.statProgressFillWarning}`}
                  style={{ width: `${(stats.processing / stats.total) * 100}%` }}
                ></div>
              </div>
              <div className={statsStyles.statProgressText}>
                <span>{stats.processing}</span>
                <span>{Math.round((stats.processing / stats.total) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${statsStyles.statCardPremium} ${statsStyles.statAnimateHover}`}>
          <div className={statsStyles.statHeader}>
            <h3 className={statsStyles.statTitle}>Đã giao</h3>
            <div className={`${statsStyles.statIcon} ${statsStyles.statIconSuccess}`}>
              ✅
            </div>
          </div>
          <div className={statsStyles.statContent}>
            <div className={statsStyles.statValue}>{stats.completed}</div>
            <div className={statsStyles.statLabel}>Thành công</div>
          </div>
          <div className={statsStyles.statFooter}>
            <div className={`${statsStyles.statChange} ${statsStyles.statChangePositive}`}>
              <span className={statsStyles.statChangeIcon}>↑</span>
              <span>8% so với tháng trước</span>
            </div>
            <div className={statsStyles.statPeriod}>Tháng 10</div>
          </div>
        </div>

        <div className={`${statsStyles.statCardPremium} ${statsStyles.statAnimateHover}`}>
          <div className={statsStyles.statHeader}>
            <h3 className={statsStyles.statTitle}>Doanh thu</h3>
            <div className={`${statsStyles.statIcon} ${statsStyles.statIconInfo}`}>
              💰
            </div>
          </div>
          <div className={statsStyles.statContent}>
            <div className={statsStyles.statValue}>{stats.totalRevenue.toLocaleString()}đ</div>
            <div className={statsStyles.statLabel}>Tổng doanh thu</div>
          </div>
          <div className={statsStyles.statFooter}>
            <div className={`${statsStyles.statChange} ${statsStyles.statChangePositive}`}>
              <span className={statsStyles.statChangeIcon}>↑</span>
              <span>15% so với tháng trước</span>
            </div>
            <div className={statsStyles.statPeriod}>Tháng 10</div>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className={`${cardStyles.cardPremium} mb-4`}>
        <div className={cardStyles.cardHeaderPremium}>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <h2 className={`${cardStyles.cardTitleLarge} mb-2`}>Quản lý đơn hàng</h2>
              <p className={cardStyles.cardSubtitle}>Theo dõi và quản lý tất cả đơn hàng</p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <div className={formStyles.formFilter}>
                <div className={formStyles.formFilterGroup}>
                  <span className={formStyles.formFilterLabel}>Trạng thái:</span>
                  <select 
                    className={formStyles.formSelect}
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
              </div>
              <button className={`${buttonStyles.button} ${buttonStyles.buttonSecondary}`}>
                📊 Xuất báo cáo
              </button>
              <button className={`${buttonStyles.button} ${buttonStyles.buttonPrimary}`}>
                🔄 Tải lại
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section with Enhanced Responsive Container */}
      <AdminResponsiveContainer 
        data={filteredOrders}
        loading={false}
        empty={filteredOrders.length === 0}
        cardComponent={cardComponent}
        onResponsiveChange={(responsiveInfo) => {
          console.log('Orders view changed:', responsiveInfo);
        }}
        accessibility={{
          announceViewChanges: true,
          viewChangeMessage: 'Orders view changed to {view}'
        }}
        className="orders-responsive-container"
      >
        <div className={`${styles.tableContainerPremium} ${styles.tableAnimateIn}`}>
          <div className={styles.tableResponsive}>
            <table className={`${styles.table} ${styles.tableRowHover}`}>
              <thead className={styles.tableHeaderPrimary}>
                <tr>
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
                  <th>
                    <div className={styles.tableSortable}>
                      <span>Số điện thoại</span>
                      <span className={styles.tableSortIcon}></span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableSortable}>
                      <span>Tổng tiền</span>
                      <span className={styles.tableSortIcon}></span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableSortable}>
                      <span>Trạng thái</span>
                      <span className={styles.tableSortIcon}></span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableSortable}>
                      <span>Thời gian</span>
                      <span className={styles.tableSortIcon}></span>
                    </div>
                  </th>
                  <th style={{ width: 200 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className={styles.tableEmpty}>
                        <div className={styles.tableEmptyIcon}>📦</div>
                        <div className={styles.tableEmptyTitle}>Không tìm thấy đơn hàng</div>
                        <div className={styles.tableEmptyDescription}>
                          {filter !== 'all' ? 'Thử chọn trạng thái khác' : 'Chưa có đơn hàng nào'}
                        </div>
                        <button 
                          className={`${buttonStyles.button} ${buttonStyles.buttonOutline}`}
                          onClick={() => setFilter('all')}
                        >
                          Xem tất cả đơn hàng
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => (
                    <tr key={order.id} className="admin-animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className={styles.tableCellBold}>
                        <span className="badge bg-light text-dark border">
                          {order.id}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ 
                              width: 32, 
                              height: 32,
                              background: 'linear-gradient(135deg, #ff4d4f 0%, #ff6b6b 100%)',
                              color: 'white',
                              fontSize: 14,
                              fontWeight: 'bold'
                            }}
                          >
                            {order.customer.charAt(0)}
                          </div>
                          <div>
                            <div className={styles.tableCellBold}>{order.customer}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.tableCellMuted}>
                          📞 {order.phone}
                        </div>
                      </td>
                      <td>
                        <div className={`${styles.tableCellBold} ${styles.tableCellSuccess}`}>
                          {order.total.toLocaleString()} đ
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.tableBadge} ${styles[`tableBadge${statusVariant[order.status] === 'primary' ? 'Pending' : statusVariant[order.status] === 'success' ? 'Active' : statusVariant[order.status] === 'warning' ? 'Inactive' : 'Error'}`]}`}>
                          <span className="me-1">{statusIcons[order.status]}</span>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.tableCellMuted}>
                          🕒 {order.createdAt}
                        </div>
                      </td>
                      <td>
                        <div className={styles.tableActions}>
                          <button 
                            className={`${styles.tableAction} ${styles.tableActionSuccess}`}
                            title="Xem chi tiết"
                            onClick={() => handleView(order.id)}
                          >
                            👁️
                          </button>
                          <button 
                            className={styles.tableAction}
                            title="Cập nhật trạng thái"
                            onClick={() => handleEdit(order.id)}
                          >
                            📝
                          </button>
                          {order.status === 'Đang xử lý' && (
                            <button 
                              className={`${styles.tableAction} ${styles.tableActionDanger}`}
                              title="Hủy đơn hàng"
                              onClick={() => handleCancel(order.id)}
                            >
                              ❌
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer with Pagination */}
          {filteredOrders.length > 0 && (
            <div className={styles.tablePagination}>
              <div className={styles.tablePaginationInfo}>
                Hiển thị {filteredOrders.length} trên {mockOrders.length} đơn hàng
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
      </AdminResponsiveContainer>
    </div>
  );
};

export default ManageOrders;
