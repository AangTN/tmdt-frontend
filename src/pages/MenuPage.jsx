import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Form, Spinner, Badge } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import EmptyState from '../components/ui/EmptyState';
import { fetchFoods, fetchTypes } from '../services/api';

const MenuPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pizzas, setPizzas] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [foodsData, typesData] = await Promise.all([
          fetchFoods(),
          fetchTypes()
        ]);
        if (mounted) {
          setPizzas(Array.isArray(foodsData) ? foodsData : []);
          setTypes(Array.isArray(typesData) ? typesData : []);
          // Auto select first type
          if (typesData && typesData.length > 0) {
            setSelectedType(typesData[0].MaLoaiMonAn);
          }
        }
      } catch (e) {
        setError('Không tải được menu.');
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const categoryParam = params.get('category');

  // Get available categories for selected type
  const availableCategories = useMemo(() => {
    if (!selectedType) return [];
    const foodsOfType = pizzas.filter(p => p.MaLoaiMonAn === selectedType);
    const categoryMap = new Map();
    foodsOfType.forEach(food => {
      if (Array.isArray(food.DanhMuc)) {
        food.DanhMuc.forEach(cat => {
          if (!categoryMap.has(cat.MaDanhMuc)) {
            categoryMap.set(cat.MaDanhMuc, cat);
          }
        });
      }
    });
    return Array.from(categoryMap.values());
  }, [pizzas, selectedType]);

  const filtered = pizzas.filter(p => {
    const nameOk = p.TenMonAn?.toLowerCase().includes(query.toLowerCase());
    const typeOk = selectedType ? p.MaLoaiMonAn === selectedType : true;
    const categoryOk = selectedCategory
      ? Array.isArray(p.DanhMuc) && p.DanhMuc.some(dm => dm.MaDanhMuc === selectedCategory)
      : true;
    return nameOk && typeOk && categoryOk;
  });

  const currentTypeName = types.find(t => t.MaLoaiMonAn === selectedType)?.TenLoaiMonAn || 'Tất cả';

  return (
    <section className="py-4">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Thực đơn</h2>
          <Form.Control style={{ maxWidth: 320 }} placeholder="Tìm món ăn..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        {/* Type Tabs */}
        {!loading && types.length > 0 && (
          <div className="mb-4 d-flex gap-2 flex-wrap">
            {types.map(type => (
              <Badge
                key={type.MaLoaiMonAn}
                bg={selectedType === type.MaLoaiMonAn ? 'danger' : 'light'}
                text={selectedType === type.MaLoaiMonAn ? 'white' : 'dark'}
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.75rem 1.5rem', 
                  fontSize: '1rem',
                  fontWeight: selectedType === type.MaLoaiMonAn ? 700 : 600,
                  transition: 'all 0.3s ease',
                  border: selectedType === type.MaLoaiMonAn ? 'none' : '2px solid #dee2e6'
                }}
                onClick={() => {
                  setSelectedType(type.MaLoaiMonAn);
                  setSelectedCategory(null); // Reset category when changing type
                }}
              >
                {type.TenLoaiMonAn}
              </Badge>
            ))}
          </div>
        )}

        {/* Category Chips */}
        {!loading && availableCategories.length > 0 && (
          <div className="mb-4">
            <div className="text-muted small mb-2" style={{ fontWeight: 600 }}>Lọc theo danh mục:</div>
            <div className="d-flex gap-2 flex-wrap">
              <Badge
                bg={selectedCategory === null ? 'dark' : 'secondary'}
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.9rem',
                  fontWeight: selectedCategory === null ? 700 : 500,
                  transition: 'all 0.3s ease',
                  opacity: selectedCategory === null ? 1 : 0.6
                }}
                onClick={() => setSelectedCategory(null)}
              >
                Tất cả
              </Badge>
              {availableCategories.map(cat => (
                <Badge
                  key={cat.MaDanhMuc}
                  bg={selectedCategory === cat.MaDanhMuc ? 'dark' : 'secondary'}
                  style={{ 
                    cursor: 'pointer', 
                    padding: '0.5rem 1rem', 
                    fontSize: '0.9rem',
                    fontWeight: selectedCategory === cat.MaDanhMuc ? 700 : 500,
                    transition: 'all 0.3s ease',
                    opacity: selectedCategory === cat.MaDanhMuc ? 1 : 0.6
                  }}
                  onClick={() => setSelectedCategory(cat.MaDanhMuc)}
                >
                  {cat.TenDanhMuc}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {categoryParam && (
          <div className="mb-3">
            <small className="text-muted">
              Bộ lọc: Danh mục #{categoryParam}
              <button className="btn btn-link btn-sm ms-2 p-0 align-baseline" onClick={() => navigate('/menu')}>Xóa lọc</button>
            </small>
          </div>
        )}

        {loading && (
          <div className="text-center py-5"><Spinner animation="border" /></div>
        )}
        {!loading && error && (
          <EmptyState title="Có lỗi xảy ra" description={error} />
        )}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState title="Không tìm thấy món ăn" description="Hãy thử từ khóa khác hoặc chọn loại món khác." />
        )}
        {!loading && !error && filtered.length > 0 && (
          <div>
            <h3 className="mb-4 pb-2 border-bottom border-danger" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              {currentTypeName}
            </h3>
            <Row xs={1} sm={2} md={3} lg={4} className="g-3">
              {filtered.map(pizza => (
                <Col key={pizza.MaMonAn}>
                  <ProductCard pizza={pizza} />
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>
    </section>
  );
};

export default MenuPage;
