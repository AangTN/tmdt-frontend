import React, { useEffect, useMemo, useState } from 'react';
import { fetchFoods, fetchTypes, fetchCategories } from '../../services/api';
import styles from '../../styles/admin/AdminTable.module.css';
import buttonStyles from '../../styles/admin/AdminButton.module.css';
import formStyles from '../../styles/admin/AdminForm.module.css';
import cardStyles from '../../styles/admin/AdminCard.module.css';
import { AdminResponsiveContainer } from '../../components/admin/AdminResponsiveContainer';
import { ProductCard } from '../../components/admin/AdminTableCard';

const ManageProducts = () => {
  const [foods, setFoods] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [foodsRes, typesRes, categoriesRes] = await Promise.all([
          fetchFoods().catch(() => []),
          fetchTypes().catch(() => []),
          fetchCategories().catch(() => []),
        ]);
        if (!mounted) return;
        setFoods(Array.isArray(foodsRes) ? foodsRes : []);
        setTypes(Array.isArray(typesRes) ? typesRes : []);
        setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const typeMap = useMemo(() => Object.fromEntries(types.map(t => [t.MaLoaiMonAn, t.TenLoaiMonAn])), [types]);

  const filteredFoods = foods.filter(food =>
    food.TenMonAn?.toLowerCase().includes(search.toLowerCase())
  );

  // Action handlers
  const handleEdit = (product) => {
    console.log('Edit product:', product);
    // TODO: Implement edit functionality
  };

  const handleDelete = (product) => {
    console.log('Delete product:', product);
    // TODO: Implement delete functionality
  };

  const handleView = (product) => {
    console.log('View product details:', product);
    // TODO: Implement view functionality
  };

  // Card component for responsive view
  const cardComponent = (
    <div className={styles.adminTableCards}>
      {filteredFoods.map((product, index) => (
        <ProductCard
          key={product.MaMonAn}
          data={product}
          type="product"
          typeMap={typeMap}
          onEdit={() => handleEdit(product)}
          onDelete={() => handleDelete(product)}
          onView={() => handleView(product)}
          index={index}
          animate={true}
          showImage={true}
        />
      ))}
    </div>
  );

  return (
    <div className="admin-animate-fade-in">
      {/* Header Section */}
      <div className={`${cardStyles.cardPremium} mb-4`}>
        <div className={cardStyles.cardHeaderPremium}>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <h2 className={`${cardStyles.cardTitleLarge} mb-2`}>Quản lý sản phẩm</h2>
              <p className={cardStyles.cardSubtitle}>Tổng số: {foods.length} món ăn</p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <div className={formStyles.formSearch}>
                <span className={formStyles.formSearchIcon}>🔍</span>
                <input
                  type="search"
                  className={`${formStyles.formInput} ${formStyles.formSearchInput}`}
                  placeholder="Tìm sản phẩm..."
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
              <button className={`${buttonStyles.button} ${buttonStyles.buttonPrimary} ${buttonStyles.buttonLarge}`}>
                <span>+</span> Thêm sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section with Enhanced Responsive Container */}
      <AdminResponsiveContainer 
        data={filteredFoods}
        loading={loading}
        empty={filteredFoods.length === 0}
        cardComponent={cardComponent}
        onResponsiveChange={(responsiveInfo) => {
          console.log('View changed:', responsiveInfo);
        }}
        accessibility={{
          announceViewChanges: true,
          viewChangeMessage: 'Product view changed to {view}'
        }}
        className="products-responsive-container"
      >
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
                      <span>Tên món</span>
                      <span className={styles.tableSortIcon}></span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableSortable}>
                      <span>Loại</span>
                      <span className={styles.tableSortIcon}></span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableSortable}>
                      <span>Danh mục</span>
                      <span className={styles.tableSortIcon}></span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableSortable}>
                      <span>Mô tả</span>
                      <span className={styles.tableSortIcon}></span>
                    </div>
                  </th>
                  <th style={{ width: 180 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <div className={styles.tableLoadingOverlay}>
                        <div className={styles.tableLoadingSpinner}></div>
                      </div>
                      <div className="mt-3">
                        <small className="text-muted">Đang tải dữ liệu...</small>
                      </div>
                    </td>
                  </tr>
                ) : filteredFoods.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className={styles.tableEmpty}>
                        <div className={styles.tableEmptyIcon}>📦</div>
                        <div className={styles.tableEmptyTitle}>Không tìm thấy sản phẩm</div>
                        <div className={styles.tableEmptyDescription}>
                          {search ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có dữ liệu sản phẩm'}
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
                  filteredFoods.map((food, index) => (
                    <tr key={food.MaMonAn} className="admin-animate-slide-up">
                      <td className={styles.tableCellBold}>
                        <span className="badge bg-light text-dark border">
                          {index + 1}
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
                                background: 'linear-gradient(135deg, #ff4d4f 0%, #ff6b6b 100%)'
                              }}
                            >
                              <span style={{ fontSize: 20 }}>🍕</span>
                            </div>
                          </div>
                          <div>
                            <div className={`${styles.tableCellBold} mb-1`}>{food.TenMonAn}</div>
                            <small className={styles.tableCellMuted}>Mã: {food.MaMonAn}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {typeMap[food.MaLoaiMonAn] ? (
                          <span className={`${styles.tableBadge} ${styles.tableBadgeActive}`}>
                            {typeMap[food.MaLoaiMonAn]}
                          </span>
                        ) : (
                          <span className={styles.tableCellMuted}>—</span>
                        )}
                      </td>
                      <td>
                        {Array.isArray(food.DanhMuc) && food.DanhMuc.length > 0 ? (
                          <div className="d-flex flex-wrap gap-1">
                            {food.DanhMuc.map((cat, idx) => (
                              <span 
                                key={idx}
                                className={`${styles.tableBadge} ${styles.tableBadgeInfo}`}
                              >
                                {cat.TenDanhMuc}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className={styles.tableCellMuted}>—</span>
                        )}
                      </td>
                      <td>
                        <div className={`${styles.tableCellMuted} text-truncate`} style={{ maxWidth: 200 }}>
                          {food.MoTa || 'Chưa cập nhật'}
                        </div>
                      </td>
                      <td>
                        <div className={styles.tableActions}>
                          <button 
                            className={`${styles.tableAction} ${styles.tableActionSuccess}`}
                            title="Chỉnh sửa"
                            onClick={() => handleEdit(food)}
                          >
                            ✏️
                          </button>
                          <button 
                            className={`${styles.tableAction} ${styles.tableActionDanger}`}
                            title="Xóa"
                            onClick={() => handleDelete(food)}
                          >
                            🗑️
                          </button>
                          <button 
                            className={styles.tableAction}
                            title="Xem chi tiết"
                            onClick={() => handleView(food)}
                          >
                            👁️
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
          {!loading && filteredFoods.length > 0 && (
            <div className={styles.tablePagination}>
              <div className={styles.tablePaginationInfo}>
                Hiển thị {filteredFoods.length} trên {foods.length} sản phẩm
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

      {/* Quick Stats */}
      <div className="row g-3 mt-4">
        <div className="col-md-3">
          <div className={`${cardStyles.card} ${cardStyles.cardAnimateHover}`}>
            <div className={cardStyles.cardBody}>
              <div className={cardStyles.cardStats}>
                <div>
                  <div className={cardStyles.cardStatValue}>{foods.length}</div>
                  <div className={cardStyles.cardStatLabel}>Tổng sản phẩm</div>
                </div>
                <div className={`${cardStyles.cardStatIcon} ${cardStyles.cardStatIconPrimary}`}>
                  📦
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
                  <div className={cardStyles.cardStatValue}>{types.length}</div>
                  <div className={cardStyles.cardStatLabel}>Loại món</div>
                </div>
                <div className={`${cardStyles.cardStatIcon} ${cardStyles.cardStatIconSuccess}`}>
                  🏷️
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
                  <div className={cardStyles.cardStatValue}>{categories.length}</div>
                  <div className={cardStyles.cardStatLabel}>Danh mục</div>
                </div>
                <div className={`${cardStyles.cardStatIcon} ${cardStyles.cardStatIconInfo}`}>
                  📁
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
                  <div className={cardStyles.cardStatValue}>{filteredFoods.length}</div>
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

export default ManageProducts;
