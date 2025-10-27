import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { fetchFoods, fetchTypes, fetchCategories } from '../services/api';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [f, t, c] = await Promise.all([
          fetchFoods(),
          fetchTypes(),
          fetchCategories(),
        ]);
        if (mounted) {
          setFoods(Array.isArray(f) ? f : []);
          setTypes(Array.isArray(t) ? t : []);
          setCategories(Array.isArray(c) ? c : []);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const featured = useMemo(() => foods.slice(0, 8), [foods]);

  return (
    <>
      {/* HERO */}
      <section className={`${styles.hero}`}>
        <Container>
          <Row className="align-items-center">
            <Col md={7} className="mb-4 mb-md-0">
              <div className={styles.heroContent}>
                <div className={styles.promoTag}>🔥 ƯU ĐÃI HÔM NAY - GIẢM TỚI 30%</div>
                <h1 className="display-4 fw-bold mb-3">
                  Pizza nóng hổi,<br />
                  giao <span style={{ textDecoration: 'underline', textDecorationColor: '#ffc107', textDecorationThickness: '4px' }}>siêu tốc</span>
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.25rem', opacity: 0.95 }}>
                  Chọn chiếc pizza yêu thích từ menu đa dạng với hơn 50+ món.<br />
                  Nguyên liệu tươi ngon, công thức độc quyền - Hương vị Ý chính gốc
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link to="/menu">
                    <Button size="lg" className="btn-danger px-4 py-3 fw-bold">
                      🍕 Đặt ngay
                    </Button>
                  </Link>
                  <Link to="/menu">
                    <Button variant="outline-light" size="lg" className="px-4 py-3 fw-bold">
                      Xem menu
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
            <Col md={5}>
              <div className={`${styles.heroCard} p-3 rounded-4 bg-white text-dark`}>
                <div className="ratio ratio-1x1 rounded-3 overflow-hidden mb-3 bg-light">
                  <img src="/placeholder.svg" alt="Pizza" style={{ objectFit: 'cover' }} />
                </div>
                <Row className="text-center g-2">
                  <Col xs={4}><small className="text-muted d-block">⭐ 4.8/5</small><small className="fw-bold">Đánh giá</small></Col>
                  <Col xs={4}><small className="text-muted d-block">🚚 30'</small><small className="fw-bold">Giao nhanh</small></Col>
                  <Col xs={4}><small className="text-muted d-block">🎁 Deal</small><small className="fw-bold">Mỗi ngày</small></Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* QUICK FILTERS */}
      <section className={`${styles.quickFilterSection} py-4`}>
        <Container>
          <Row className="gy-2 align-items-center">
            <Col md={2}>
              <div className="fw-bold text-dark">🔍 Khám phá nhanh:</div>
            </Col>
            <Col md={10}>
              <div className="d-flex flex-wrap gap-2">
                {types.slice(0, 4).map(t => (
                  <Link key={t.MaLoaiMonAn} to={`/menu?type=${t.MaLoaiMonAn}`}>
                    <Button variant="outline-danger" size="sm" className={styles.filterBtn}>
                      {t.TenLoaiMonAn}
                    </Button>
                  </Link>
                ))}
                {categories.slice(0, 4).map(c => (
                  <Link key={c.MaDanhMuc} to={`/menu?category=${c.MaDanhMuc}`}>
                    <Button variant="outline-secondary" size="sm" className={styles.filterBtn}>
                      {c.TenDanhMuc}
                    </Button>
                  </Link>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FEATURED FOODS */}
      <section className="py-5 bg-white">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className={styles.sectionTitle}>Món nổi bật</h2>
              <p className="text-muted">Các món được yêu thích nhất tuần này</p>
            </div>
            <Link to="/menu" className="btn btn-outline-danger">
              Xem tất cả →
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" />
              <p className="mt-3 text-muted">Đang tải món ngon...</p>
            </div>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className={`g-4 ${styles.featuredGrid}`}>
              {featured.map(item => (
                <Col key={item.MaMonAn}>
                  <ProductCard pizza={item} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* STATS / CTA */}
      <section className="py-5" style={{ background: 'linear-gradient(to bottom, #fafafa, #fff)' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className={styles.sectionTitle}>Tại sao chọn Secret Pizza?</h2>
            <p className="text-muted">Con số nói lên tất cả</p>
          </div>
          <Row className="g-4 text-center">
            <Col md={3} sm={6}>
              <div className={styles.statsCard}>
                <div className={styles.statsNumber}>30'</div>
                <div className="text-muted fw-semibold mt-2">Giao hàng trung bình</div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className={styles.statsCard}>
                <div className={styles.statsNumber}>50+</div>
                <div className="text-muted fw-semibold mt-2">Món ăn đa dạng</div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className={styles.statsCard}>
                <div className={styles.statsNumber}>100%</div>
                <div className="text-muted fw-semibold mt-2">Nguyên liệu tươi</div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className={styles.statsCard}>
                <div className={styles.statsNumber}>24/7</div>
                <div className="text-muted fw-semibold mt-2">Đặt món online</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomePage;
