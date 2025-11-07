import React, { useMemo, useState } from 'react';
import styles from '../../styles/admin/AdminTable.module.css';
import buttonStyles from '../../styles/admin/AdminButton.module.css';
import formStyles from '../../styles/admin/AdminForm.module.css';
import cardStyles from '../../styles/admin/AdminCard.module.css';

const mockUsers = [
  {
    id: 'U001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901 234 567',
    role: 'customer',
    status: 'active',
    totalOrders: 12,
    lastOrder: '22/10/2025',
    lastLogin: '26/10/2025 21:15'
  },
  {
    id: 'U002',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0909 888 777',
    role: 'customer',
    status: 'pending',
    totalOrders: 1,
    lastOrder: '18/10/2025',
    lastLogin: '18/10/2025 14:04'
  },
  {
    id: 'U003',
    name: 'Phạm Minh C',
    email: 'phamminhc@example.com',
    phone: '0912 456 789',
    role: 'staff',
    status: 'active',
    totalOrders: 0,
    lastOrder: '—',
    lastLogin: '27/10/2025 08:45'
  },
  {
    id: 'U004',
    name: 'Lê Hồng D',
    email: 'lehond@example.com',
    phone: '0981 222 333',
    role: 'customer',
    status: 'suspended',
    totalOrders: 5,
    lastOrder: '05/09/2025',
    lastLogin: '07/09/2025 19:22'
  },
  {
    id: 'U005',
    name: 'Admin Nội Bộ',
    email: 'admin@example.com',
    phone: '0903 111 222',
    role: 'admin',
    status: 'active',
    totalOrders: 0,
    lastOrder: '—',
    lastLogin: '28/10/2025 07:30'
  }
];

const roleLabels = {
  customer: 'Khách hàng',
  staff: 'Nhân viên',
  admin: 'Quản trị viên'
};

const statusLabels = {
  active: 'Hoạt động',
  pending: 'Chờ xác minh',
  suspended: 'Tạm khóa'
};

const statusVariant = {
  active: 'tableBadgeActive',
  pending: 'tableBadgePending',
  suspended: 'tableBadgeError'
};

const ManageUsers = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter((user) => user.status === 'active').length;
  const staffUsers = mockUsers.filter((user) => user.role !== 'customer').length;

  // Filter mock users by search term, role, and status selections.
  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return mockUsers.filter((user) => {
      const matchesSearch = normalizedSearch.length === 0
        || [user.name, user.email, user.phone].some((field) => field.toLowerCase().includes(normalizedSearch));
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, search, statusFilter]);

  return (
    <div className="admin-animate-fade-in">
      {/* Header Section */}
      <div className={`${cardStyles.cardPremium} mb-4`}>
        <div className={cardStyles.cardHeaderPremium}>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <h2 className={`${cardStyles.cardTitleLarge} mb-2`}>Quản lý người dùng</h2>
              <p className={cardStyles.cardSubtitle}>Tổng số: {totalUsers} tài khoản • {activeUsers} đang hoạt động • {staffUsers} nhân sự</p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <div className={formStyles.formSearch}>
                <span className={formStyles.formSearchIcon}>🔍</span>
                <input
                  type="search"
                  className={`${formStyles.formInput} ${formStyles.formSearchInput}`}
                  placeholder="Tìm theo tên, email, số điện thoại..."
                  style={{ minWidth: 280 }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
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
              <select
                className={`${formStyles.formSelect}`}
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                style={{ minWidth: 150 }}
              >
                <option value="all">Tất cả vai trò</option>
                <option value="customer">Khách hàng</option>
                <option value="staff">Nhân viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
              <select
                className={`${formStyles.formSelect}`}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                style={{ minWidth: 150 }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="pending">Chờ xác minh</option>
                <option value="suspended">Tạm khóa</option>
              </select>
              <button className={`${buttonStyles.button} ${buttonStyles.buttonPrimary} ${buttonStyles.buttonLarge}`}>
                <span>+</span> Thêm người dùng
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
                    <span>Mã người dùng</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th>
                  <div className={styles.tableSortable}>
                    <span>Họ tên</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th>
                  <div className={styles.tableSortable}>
                    <span>Email</span>
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
                    <span>Vai trò</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th>
                  <div className={styles.tableSortable}>
                    <span>Đơn đã đặt</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th>
                  <div className={styles.tableSortable}>
                    <span>Đơn gần nhất</span>
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
                    <span>Lần đăng nhập cuối</span>
                    <span className={styles.tableSortIcon}></span>
                  </div>
                </th>
                <th style={{ width: 200 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <div className={styles.tableEmpty}>
                      <div className={styles.tableEmptyIcon}>👥</div>
                      <div className={styles.tableEmptyTitle}>Không có người dùng</div>
                      <div className={styles.tableEmptyDescription}>
                        {search || roleFilter !== 'all' || statusFilter !== 'all' 
                          ? 'Chưa có người dùng phù hợp với bộ lọc được chọn.' 
                          : 'Chưa có dữ liệu người dùng.'}
                      </div>
                      <button 
                        className={`${buttonStyles.button} ${buttonStyles.buttonOutline}`}
                        onClick={() => {
                          setSearch('');
                          setRoleFilter('all');
                          setStatusFilter('all');
                        }}
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="admin-animate-slide-up">
                    <td className={styles.tableCellBold}>
                      <span className="badge bg-light text-dark border">
                        {user.id}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-start gap-3">
                        <div className="flex-shrink-0">
                          <div 
                            className="rounded-2 bg-gradient d-flex align-items-center justify-content-center"
                            style={{ 
                              width: 48, 
                              height: 48,
                              background: user.role === 'admin' 
                                ? 'linear-gradient(135deg, #ff4d4f 0%, #ff6b6b 100%)'
                                : user.role === 'staff'
                                ? 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)'
                                : 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)'
                            }}
                          >
                            <span style={{ fontSize: 20 }}>
                              {user.role === 'admin' ? '👑' : user.role === 'staff' ? '👨‍💼' : '👤'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className={`${styles.tableCellBold} mb-1`}>{user.name}</div>
                          <small className={styles.tableCellMuted}>ID: {user.id}</small>
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCellText}>{user.email}</td>
                    <td className={styles.tableCellMuted}>{user.phone}</td>
                    <td>
                      <span className={`${styles.tableBadge} ${
                        user.role === 'admin' ? styles.tableBadgeWarning :
                        user.role === 'staff' ? styles.tableBadgeInfo :
                        styles.tableBadgeActive
                      }`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className={styles.tableCellSuccess}>{user.totalOrders}</td>
                    <td className={styles.tableCellMuted}>{user.lastOrder}</td>
                    <td>
                      <span className={`${styles.tableBadge} ${statusVariant[user.status] || styles.tableBadgeInfo}`}>
                        {statusLabels[user.status] || user.status}
                      </span>
                    </td>
                    <td className={styles.tableCellMuted}>
                      <small>{user.lastLogin}</small>
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <button 
                          className={`${styles.tableAction} ${styles.tableActionSuccess}`}
                          title="Xem chi tiết"
                          disabled
                        >
                          👁️
                        </button>
                        <button 
                          className={styles.tableAction}
                          title="Đặt lại mật khẩu"
                          disabled
                        >
                          🔑
                        </button>
                        <button 
                          className={`${styles.tableAction} ${styles.tableActionDanger}`}
                          title={user.status === 'suspended' ? 'Mở khóa' : 'Khóa tài khoản'}
                          disabled
                        >
                          {user.status === 'suspended' ? '🔓' : '🔒'}
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
        {filteredUsers.length > 0 && (
          <div className={styles.tablePagination}>
            <div className={styles.tablePaginationInfo}>
              Hiển thị {filteredUsers.length} trên {totalUsers} người dùng
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

      {/* Quick Stats */}
      <div className="row g-3 mt-4">
        <div className="col-md-3">
          <div className={`${cardStyles.card} ${cardStyles.cardAnimateHover}`}>
            <div className={cardStyles.cardBody}>
              <div className={cardStyles.cardStats}>
                <div>
                  <div className={cardStyles.cardStatValue}>{totalUsers}</div>
                  <div className={cardStyles.cardStatLabel}>Tổng tài khoản</div>
                </div>
                <div className={`${cardStyles.cardStatIcon} ${cardStyles.cardStatIconPrimary}`}>
                  👥
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className={`${cardStyles.card} ${cardStyles.cardAnimateHover}`}>
            <div className={cardStyles.cardBody}>
              <div className={cardStyles.cardStats}>
                <div>
                  <div className={cardStyles.cardStatValue}>{activeUsers}</div>
                  <div className={cardStyles.cardStatLabel}>Đang hoạt động</div>
                </div>
                <div className={`${cardStyles.cardStatIcon} ${cardStyles.cardStatIconSuccess}`}>
                  ✅
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className={`${cardStyles.card} ${cardStyles.cardAnimateHover}`}>
            <div className={cardStyles.cardBody}>
              <div className={cardStyles.cardStats}>
                <div>
                  <div className={cardStyles.cardStatValue}>{staffUsers}</div>
                  <div className={cardStyles.cardStatLabel}>Nhân sự nội bộ</div>
                </div>
                <div className={`${cardStyles.cardStatIcon} ${cardStyles.cardStatIconInfo}`}>
                  👨‍💼
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className={`${cardStyles.card} ${cardStyles.cardAnimateHover}`}>
            <div className={cardStyles.cardBody}>
              <div className={cardStyles.cardStats}>
                <div>
                  <div className={cardStyles.cardStatValue}>{filteredUsers.length}</div>
                  <div className={cardStyles.cardStatLabel}>Kết quả tìm kiếm</div>
                </div>
                <div className={`${cardStyles.cardStatIcon} ${cardStyles.cardStatIconWarning}`}>
                  🔍
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
