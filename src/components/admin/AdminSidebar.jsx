import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import '../../styles/admin.css';

const AdminSidebar = () => {
  const { isOpen, isCollapsed, screenSize, closeSidebar } = useSidebar();

  const navItems = [
    {
      path: '/admin',
      icon: '📊',
      label: 'Tổng quan',
      description: 'Xem thống kê'
    },
    {
      path: '/admin/products',
      icon: '🍕',
      label: 'Quản lý sản phẩm',
      description: 'Sản phẩm pizza'
    },
    {
      path: '/admin/categories',
      icon: '🏷️',
      label: 'Quản lý danh mục',
      description: 'Phân loại'
    },
    {
      path: '/admin/types',
      icon: '📂',
      label: 'Quản lý thể loại',
      description: 'Loại sản phẩm'
    },
    {
      path: '/admin/orders',
      icon: '🧾',
      label: 'Quản lý đơn hàng',
      description: 'Đơn đặt hàng'
    },
    {
      path: '/admin/users',
      icon: '👥',
      label: 'Quản lý người dùng',
      description: 'Tài khoản'
    },
    {
      path: '/admin/options',
      icon: '🧩',
      label: 'Quản lý tùy chọn',
      description: 'Tùy chọn thêm'
    },
    {
      path: '/admin/reviews',
      icon: '⭐',
      label: 'Đánh giá đơn hàng',
      description: 'Phản hồi'
    },
    {
      path: '/admin/promotions',
      icon: '🎁',
      label: 'Khuyến mãi',
      description: 'Ưu đãi'
    },
    {
      path: '/admin/banners',
      icon: '🖼️',
      label: 'Banner quảng cáo',
      description: 'Hình ảnh'
    }
  ];

  // Don't render sidebar on mobile if it's closed
  if (screenSize === 'mobile' && !isOpen) {
    return null;
  }

  const getSidebarStyles = () => {
    const baseStyles = {
      background: 'linear-gradient(180deg, var(--admin-bg-sidebar) 0%, var(--admin-bg-dark) 100%)',
      borderRight: '1px solid var(--admin-border-dark)',
      display: 'flex',
      flexDirection: 'column',
      position: screenSize === 'mobile' ? 'fixed' : 'relative',
      boxShadow: 'var(--admin-shadow-lg)',
      transition: 'var(--admin-transition-base)',
      zIndex: screenSize === 'mobile' ? 'var(--admin-z-modal)' : 'auto'
    };

    if (screenSize === 'mobile') {
      return {
        ...baseStyles,
        width: 'var(--admin-sidebar-width)',
        height: '100vh',
        top: 0,
        left: isOpen ? 0 : '-100%',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
      };
    } else if (screenSize === 'tablet') {
      return {
        ...baseStyles,
        width: isCollapsed ? 'var(--admin-sidebar-collapsed-width)' : 'var(--admin-sidebar-width)',
        minWidth: isCollapsed ? 'var(--admin-sidebar-collapsed-width)' : 'var(--admin-sidebar-width)'
      };
    } else {
      return {
        ...baseStyles,
        width: 'var(--admin-sidebar-width)',
        minWidth: 'var(--admin-sidebar-width)'
      };
    }
  };

  const handleNavClick = () => {
    if (screenSize === 'mobile') {
      closeSidebar();
    }
  };

  return (
    <>
      <aside style={getSidebarStyles()}>
        {/* Sidebar Header */}
        <div 
          style={{
            padding: isCollapsed && screenSize !== 'mobile' ? 'var(--admin-space-md)' : 'var(--admin-space-lg)',
            borderBottom: '1px solid var(--admin-border-dark)',
            background: 'rgba(255, 77, 79, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'var(--admin-transition-base)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: isCollapsed && screenSize !== 'mobile' ? 0 : 'var(--admin-space-md)', justifyContent: isCollapsed && screenSize !== 'mobile' ? 'center' : 'flex-start' }}>
            <div 
              style={{
                width: isCollapsed && screenSize !== 'mobile' ? '24px' : '32px',
                height: isCollapsed && screenSize !== 'mobile' ? '24px' : '32px',
                background: 'linear-gradient(135deg, var(--admin-primary) 0%, var(--admin-primary-light) 100%)',
                borderRadius: 'var(--admin-radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isCollapsed && screenSize !== 'mobile' ? '12px' : '16px',
                fontWeight: 'var(--admin-font-weight-bold)',
                boxShadow: 'var(--admin-shadow-sm)',
                animation: 'admin-pulse 2s infinite',
                flexShrink: 0
              }}
            >
              🍕
            </div>
            {!isCollapsed && screenSize !== 'mobile' && (
              <div>
                <h3 
                  style={{
                    margin: 0,
                    fontSize: 'var(--admin-font-size-lg)',
                    fontWeight: 'var(--admin-font-weight-bold)',
                    color: 'var(--admin-text-inverse)',
                    lineHeight: 'var(--admin-line-height-tight)'
                  }}
                >
                  Bảng điều khiển
                </h3>
                <p 
                  style={{
                    margin: '2px 0 0 0',
                    fontSize: 'var(--admin-font-size-xs)',
                    color: 'var(--admin-text-tertiary)',
                    fontWeight: 'var(--admin-font-weight-medium)'
                  }}
                >
                  Quản trị cửa hàng
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav 
          style={{
            flex: 1,
            padding: isCollapsed && screenSize !== 'mobile' ? 'var(--admin-space-sm)' : 'var(--admin-space-md)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: isCollapsed && screenSize !== 'mobile' ? 'var(--admin-space-xs)' : 'var(--admin-space-xs)'
          }}
        >
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={handleNavClick}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed && screenSize !== 'mobile' ? 'center' : 'flex-start',
                gap: isCollapsed && screenSize !== 'mobile' ? 0 : 'var(--admin-space-md)',
                padding: isCollapsed && screenSize !== 'mobile' ? 'var(--admin-space-sm)' : 'var(--admin-space-md)',
                borderRadius: 'var(--admin-radius-lg)',
                textDecoration: 'none',
                transition: 'var(--admin-transition-base)',
                position: 'relative',
                overflow: 'hidden',
                background: isActive 
                  ? 'linear-gradient(135deg, var(--admin-primary) 0%, var(--admin-primary-light) 100%)'
                  : 'transparent',
                color: isActive 
                  ? 'var(--admin-white)' 
                  : 'var(--admin-text-tertiary)',
                fontWeight: isActive 
                  ? 'var(--admin-font-weight-semibold)' 
                  : 'var(--admin-font-weight-medium)',
                fontSize: 'var(--admin-font-size-sm)',
                border: isActive 
                  ? '1px solid rgba(255, 77, 79, 0.3)'
                  : '1px solid transparent',
                boxShadow: isActive 
                  ? 'var(--admin-shadow-md)'
                  : 'none',
                transform: isActive 
                  ? (isCollapsed && screenSize !== 'mobile' ? 'scale(1.05)' : 'translateX(4px)')
                  : (isCollapsed && screenSize !== 'mobile' ? 'scale(1)' : 'translateX(0)'),
                animationDelay: `${index * 0.05}s`,
                minHeight: isCollapsed && screenSize !== 'mobile' ? '44px' : 'auto'
              })}
              className={({ isActive }) => isActive ? 'admin-animate-scale-in' : ''}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'rgba(255, 77, 79, 0.1)';
                  e.currentTarget.style.color = 'var(--admin-primary-light)';
                  e.currentTarget.style.transform = isCollapsed && screenSize !== 'mobile' ? 'scale(1.1)' : 'translateX(8px)';
                  e.currentTarget.style.borderColor = 'rgba(255, 77, 79, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--admin-text-tertiary)';
                  e.currentTarget.style.transform = isCollapsed && screenSize !== 'mobile' ? 'scale(1)' : 'translateX(0)';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
              title={isCollapsed && screenSize !== 'mobile' ? item.label : undefined}
            >
              {/* Active Indicator */}
              <span 
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '20px',
                  background: 'var(--admin-white)',
                  borderRadius: '0 2px 2px 0',
                  opacity: ({ isActive }) => isActive ? 1 : 0,
                  transition: 'var(--admin-transition-base)'
                }}
              />
              
              {/* Icon */}
              <span 
                style={{
                  fontSize: isCollapsed && screenSize !== 'mobile' ? '20px' : '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  filter: ({ isActive }) => isActive ? 'none' : 'grayscale(0.5)',
                  flexShrink: 0
                }}
              >
                {item.icon}
              </span>
              
              {/* Content */}
              {!isCollapsed && screenSize !== 'mobile' && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontWeight: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 'var(--admin-line-height-tight)'
                  }}>
                    {item.label}
                  </div>
                  <div style={{ 
                    fontSize: 'var(--admin-font-size-xs)',
                    opacity: 0.8,
                    marginTop: '1px',
                    fontWeight: 'var(--admin-font-weight-normal)'
                  }}>
                    {item.description}
                  </div>
                </div>
              )}
              
              {/* Hover Arrow */}
              {!isCollapsed && screenSize !== 'mobile' && (
                <span 
                  style={{
                    fontSize: '12px',
                    opacity: 0,
                    transform: 'translateX(-4px)',
                    transition: 'var(--admin-transition-base)'
                  }}
                >
                  →
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && screenSize !== 'mobile' && (
          <div 
            style={{
              padding: 'var(--admin-space-md)',
              borderTop: '1px solid var(--admin-border-dark)',
              background: 'rgba(0, 0, 0, 0.2)'
            }}
          >
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--admin-space-sm)',
                padding: 'var(--admin-space-sm)',
                background: 'rgba(255, 77, 79, 0.1)',
                borderRadius: 'var(--admin-radius-md)',
                border: '1px solid rgba(255, 77, 79, 0.2)',
                cursor: 'pointer',
                transition: 'var(--admin-transition-base)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 77, 79, 0.2)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 77, 79, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '16px' }}>⚙️</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: 'var(--admin-font-size-xs)',
                  fontWeight: 'var(--admin-font-weight-semibold)',
                  color: 'var(--admin-text-inverse)',
                  lineHeight: 'var(--admin-line-height-tight)'
                }}>
                  Cài đặt
                </div>
                <div style={{ 
                  fontSize: 'var(--admin-font-size-xs)',
                  color: 'var(--admin-text-tertiary)',
                  marginTop: '1px'
                }}>
                  Tùy chọn hệ thống
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Decorative Gradient Overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, var(--admin-primary) 0%, var(--admin-secondary) 50%, var(--admin-primary) 100%)',
            opacity: 0.8
          }}
        />
      </aside>
    </>
  );
};

export default AdminSidebar;
