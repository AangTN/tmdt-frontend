import React, { useEffect, useState } from 'react';
import { fetchFoods, fetchCategories, fetchTypes } from '../../services/api';
import styles from '../../styles/admin/AdminCard.module.css';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    foods: 0,
    categories: 0,
    types: 0,
    orders: 24,
    revenue: 12500000,
    customers: 156,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [foodsRes, categoriesRes, typesRes] = await Promise.all([
          fetchFoods().catch(() => []),
          fetchCategories().catch(() => []),
          fetchTypes().catch(() => []),
        ]);
        if (!mounted) return;
        setStats((prev) => ({
          ...prev,
          foods: Array.isArray(foodsRes) ? foodsRes.length : 0,
          categories: Array.isArray(categoriesRes) ? categoriesRes.length : 0,
          types: Array.isArray(typesRes) ? typesRes.length : 0,
        }));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      key: 'foods',
      title: 'Sản phẩm',
      value: stats.foods,
      icon: '🍕',
      // red tone
      bg: 'rgba(255, 85, 85, 0.16)',
      borderColor: 'var(--admin-primary)',
      trend: '+12%',
      description: 'So với tháng trước',
    },
    {
      key: 'categories',
      title: 'Danh mục',
      value: stats.categories,
      icon: '🏷️',
      // green tone
      bg: 'rgba(82, 196, 26, 0.16)',
      borderColor: 'var(--admin-success)',
      trend: '+5%',
      description: 'Mới thêm',
    },
    {
      key: 'types',
      title: 'Thể loại',
      value: stats.types,
      icon: '📂',
      // blue tone
      bg: 'rgba(24, 144, 255, 0.16)',
      borderColor: 'var(--admin-info)',
      trend: '0%',
      description: 'Không đổi',
    },
    {
      key: 'orders',
      title: 'Đơn hàng chờ',
      value: stats.orders,
      icon: '🧾',
      // orange tone
      bg: 'rgba(250, 173, 20, 0.16)',
      borderColor: 'var(--admin-warning)',
      trend: '+18%',
      description: 'Hôm nay',
    },
    {
      key: 'revenue',
      title: 'Doanh thu',
      value: formatCurrency(stats.revenue),
      icon: '💰',
      // distinct cyan tone (different from blue of Thể loại)
      bg: 'rgba(0, 180, 160, 0.16)',
      borderColor: '#00B4A0',
      trend: '+25%',
      description: 'Tháng này',
    },
    {
      key: 'customers',
      title: 'Khách hàng',
      value: stats.customers,
      icon: '👥',
      // purple tone
      bg: 'rgba(114, 46, 209, 0.16)',
      borderColor: '#722ED1',
      trend: '+8%',
      description: 'Hoạt động',
    },
  ];

  return (
    <div className="admin-animate-fade-in">
      {/* Dashboard Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--admin-space-xl)',
          padding: 'var(--admin-space-lg)',
          background:
            'linear-gradient(135deg, var(--admin-bg-primary) 0%, var(--admin-bg-secondary) 100%)',
          borderRadius: 'var(--admin-radius-xl)',
          boxShadow: 'var(--admin-shadow-base)',
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 'var(--admin-font-size-3xl)',
              fontWeight: 'var(--admin-font-weight-extrabold)',
              background:
                'linear-gradient(135deg, var(--admin-text-primary) 0%, var(--admin-primary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Tổng quan cửa hàng
          </h2>
          <p
            style={{
              margin: 'var(--admin-space-xs) 0 0 0',
              fontSize: 'var(--admin-font-size-base)',
              color: 'var(--admin-text-secondary)',
              fontWeight: 'var(--admin-font-weight-medium)',
            }}
          >
            Chào mừng trở lại! Đây là tổng quan hoạt động của bạn hôm nay.
          </p>
        </div>
        {loading && (
          <div
            style={{
              padding: 'var(--admin-space-sm) var(--admin-space-md)',
              background:
                'linear-gradient(135deg, var(--admin-primary) 0%, var(--admin-primary-light) 100%)',
              color: 'var(--admin-white)',
              borderRadius: 'var(--admin-radius-lg)',
              fontSize: 'var(--admin-font-size-sm)',
              fontWeight: 'var(--admin-font-weight-semibold)',
              boxShadow: 'var(--admin-shadow-sm)',
              animation: 'admin-pulse 2s infinite',
            }}
          >
            Đang đồng bộ dữ liệu...
          </div>
        )}
      </div>

      {/* Stats Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--admin-space-lg)',
          marginBottom: 'var(--admin-space-xl)',
        }}
      >
        {statCards.map((card, index) => (
          <div
            key={card.key}
            className={`${styles.cardPremium} ${styles.cardAnimateIn}`}
            style={{
              animationDelay: `${index * 0.1}s`,
              background: `linear-gradient(135deg, var(--admin-bg-primary) 0%, ${card.bg} 100%)`,
              borderLeft: `4px solid ${card.borderColor}`,
            }}
          >
            <div className={styles.cardBody}>
              <div className={styles.cardStats}>
                <div>
                  <div className={styles.cardStatLabel}>{card.title}</div>
                  <div className={styles.cardStatValue}>{card.value}</div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--admin-space-xs)',
                      marginTop: 'var(--admin-space-xs)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--admin-font-size-xs)',
                        fontWeight: 'var(--admin-font-weight-semibold)',
                        color: card.trend.startsWith('+')
                          ? 'var(--admin-success)'
                          : 'var(--admin-text-secondary)',
                      }}
                    >
                      {card.trend}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--admin-font-size-xs)',
                        color: 'var(--admin-text-tertiary)',
                      }}
                    >
                      {card.description}
                    </span>
                  </div>
                </div>
                <div
                  className={
                    card.key === 'foods' || card.key === 'customers'
                      ? styles.cardStatIconPrimary
                      : card.key === 'categories'
                      ? styles.cardStatIconSuccess
                      : card.key === 'orders'
                      ? styles.cardStatIconWarning
                      : styles.cardStatIconInfo
                  }
                >
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 'var(--admin-space-lg)',
        }}
      >
        {/* Recent Activity Card */}
        <div
          className={`${styles.cardGradient} ${styles.cardAnimateIn}`}
          style={{ animationDelay: '0.6s' }}
        >
          <div className={styles.cardHeaderPremium}>
            <h3 className={styles.cardTitleLarge}>Hoạt động gần đây</h3>
            <p className={styles.cardSubtitle}>
              Các cập nhật mới nhất từ cửa hàng
            </p>
          </div>
          <div className={styles.cardBody}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--admin-space-md)',
              }}
            >
              {[
                {
                  icon: '🧾',
                  text: '2 đơn hàng mới vừa được tạo',
                  time: '5 phút trước',
                  color: 'var(--admin-primary)',
                },
                {
                  icon: '🍕',
                  text: 'Menu đã cập nhật thêm 1 sản phẩm đặc biệt',
                  time: '15 phút trước',
                  color: 'var(--admin-success)',
                },
                {
                  icon: '🏷️',
                  text: 'Danh mục "Pizza Hải Sản" được chỉnh sửa',
                  time: '1 giờ trước',
                  color: 'var(--admin-info)',
                },
                {
                  icon: '👥',
                  text: 'Khách hàng mới đăng ký tài khoản',
                  time: '2 giờ trước',
                  color: 'var(--admin-secondary)',
                },
                {
                  icon: '🎁',
                  text: 'Khuyến mãi cuối tuần đã bắt đầu',
                  time: '3 giờ trước',
                  color: 'var(--admin-warning)',
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--admin-space-md)',
                    padding: 'var(--admin-space-md)',
                    background: 'var(--admin-bg-secondary)',
                    borderRadius: 'var(--admin-radius-lg)',
                    borderLeft: `3px solid ${activity.color}`,
                    transition: 'var(--admin-transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow =
                      'var(--admin-shadow-sm)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{activity.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight:
                          'var(--admin-font-weight-medium)',
                        color: 'var(--admin-text-primary)',
                        fontSize: 'var(--admin-font-size-sm)',
                      }}
                    >
                      {activity.text}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--admin-font-size-xs)',
                        color: 'var(--admin-text-tertiary)',
                        marginTop: '2px',
                      }}
                    >
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div
          className={`${styles.cardGlass} ${styles.cardAnimateIn}`}
          style={{ animationDelay: '0.7s' }}
        >
          <div className={styles.cardHeaderBorderless}>
            <h3 className={styles.cardTitle}>Hành động nhanh</h3>
            <p className={styles.cardSubtitle}>Các tác vụ thường dùng</p>
          </div>
          <div className={styles.cardBody}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--admin-space-sm)',
              }}
            >
              {[
                {
                  icon: '➕',
                  text: 'Thêm sản phẩm mới',
                  color: 'var(--admin-primary)',
                },
                {
                  icon: '📦',
                  text: 'Xem đơn hàng',
                  color: 'var(--admin-info)',
                },
                {
                  icon: '📊',
                  text: 'Báo cáo doanh thu',
                  color: 'var(--admin-success)',
                },
                {
                  icon: '👥',
                  text: 'Quản lý khách hàng',
                  color: 'var(--admin-secondary)',
                },
                {
                  icon: '⚙️',
                  text: 'Cài đặt cửa hàng',
                  color: 'var(--admin-gray-600)',
                },
              ].map((action, index) => (
                <button
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--admin-space-md)',
                    padding: 'var(--admin-space-md)',
                    background: 'var(--admin-bg-secondary)',
                    border: '1px solid var(--admin-border-light)',
                    borderRadius: 'var(--admin-radius-lg)',
                    color: 'var(--admin-text-primary)',
                    fontSize: 'var(--admin-font-size-sm)',
                    fontWeight: 'var(--admin-font-weight-medium)',
                    cursor: 'pointer',
                    transition: 'var(--admin-transition-base)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = action.color;
                    e.currentTarget.style.color =
                      'var(--admin-white)';
                    e.currentTarget.style.transform =
                      'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      'var(--admin-shadow-sm)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'var(--admin-bg-secondary)';
                    e.currentTarget.style.color =
                      'var(--admin-text-primary)';
                    e.currentTarget.style.transform =
                      'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{action.icon}</span>
                  <span>{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
