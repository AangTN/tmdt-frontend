import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { fetchFoods, fetchTypes, fetchCategories, fetchBanners, assetUrl } from '../services/api';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [f, t, c, b] = await Promise.all([
          fetchFoods(),
          fetchTypes(),
          fetchCategories(),
          fetchBanners(),
        ]);
        if (mounted) {
          setFoods(Array.isArray(f) ? f : []);
          setTypes(Array.isArray(t) ? t : []);
          setCategories(Array.isArray(c) ? c : []);
          setBanners(Array.isArray(b) ? b : []);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const featured = useMemo(() => foods.slice(0, 8), [foods]);
  const bannerUrls = useMemo(() => (Array.isArray(banners) ? banners : []).map(p => assetUrl(p)), [banners]);
  const firstTypeId = useMemo(() => (types && types.length > 0 ? types[0].MaLoaiMonAn : null), [types]);

  return (
    <>
      {/* TOP BANNER (Compact 3.5:1) */}
      <section className={styles.bannerSection}>
        <Container fluid className="px-0">
          <div className={`${styles.bannerWrap} ${styles.bannerCarousel}`}>
            {bannerUrls.length > 0 ? (
              <Carousel interval={3500} controls indicators fade pause="hover" touch wrap>
                {bannerUrls.map((url, idx) => (
                  <Carousel.Item key={idx}>
                    <div className={styles.bannerFrame}>
                      <img
                        src={url}
                        alt={`Banner ${idx + 1}`}
                        loading="lazy"
                        onError={(e)=>{ try { e.currentTarget.onerror=null; e.currentTarget.src='/placeholder.svg'; } catch{} }}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <div className={styles.bannerFrame}>
                <img src="/placeholder.svg" alt="Banner" />
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* HERO CTA - Overlays bottom of banner */}
      <section className={styles.heroOverlay}>
        <Container>
          <div className={styles.ctaCard}>
            <Row className="align-items-center">
              <Col md={8}>
                <h2>🍕 Pizza nóng hổi, giao siêu tốc 30 phút</h2>
                <p>Hơn 50+ món pizza thơm ngon với nguyên liệu tươi mỗi ngày. Đặt ngay để nhận ưu đãi!</p>
              </Col>
              <Col md={4}>
                <div className={styles.ctaBtnGroup}>
                  <Link to={firstTypeId ? `/menu?type=${firstTypeId}` : '/menu'}>
                    <Button size="lg" variant="danger">
                      Đặt ngay
                    </Button>
                  </Link>
                  <a href="#featured" className="btn btn-outline-secondary btn-lg">
                    Khám phá món nổi bật
                  </a>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* QUICK EXPLORE (unified styling) */}
      <section className={`${styles.quickFilterSection} py-4`}>
        <Container>
          <div className={styles.quickCard}>
            <Row className="align-items-center g-3">
              <Col md={3} sm={12}>
                <div className={styles.quickTitle}>
                  <span className={styles.quickIcon}>�</span>
                  Khám phá nhanh
                </div>
              </Col>
              <Col md={9} sm={12}>
                <div className={styles.chipGroup}>
                  {types.slice(0, 6).map(t => (
                    <Link key={t.MaLoaiMonAn} to={`/menu?type=${t.MaLoaiMonAn}`} className={`${styles.chip} ${styles.chipPrimary}`}>
                      {t.TenLoaiMonAn}
                    </Link>
                  ))}
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* FEATURED FOODS */}
  <section id="featured" className="py-5 bg-white">
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
