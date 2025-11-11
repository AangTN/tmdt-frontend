import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Carousel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { fetchBestSellingFoods, fetchFeaturedFoods, fetchTypes, fetchCategories, fetchBanners, fetchCombos } from '../services/api';
import styles from './HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bestSellingFoods, setBestSellingFoods] = useState([]);
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [bestSelling, featured, t, c, b, comboData] = await Promise.all([
          fetchBestSellingFoods(),
          fetchFeaturedFoods(),
          fetchTypes(),
          fetchCategories(),
          fetchBanners(),
          fetchCombos(),
        ]);
        console.log('Best selling foods from API:', bestSelling);
        console.log('Featured foods from API:', featured);
        console.log('Raw banners from API:', b);
        if (mounted) {
          setBestSellingFoods(Array.isArray(bestSelling) ? bestSelling : []);
          setFeaturedFoods(Array.isArray(featured) ? featured : []);
          setTypes(Array.isArray(t) ? t : []);
          setCategories(Array.isArray(c) ? c : []);
          const bannerData = Array.isArray(b?.data) ? b.data : (Array.isArray(b) ? b : []);
          setBanners(bannerData);
          setCombos(Array.isArray(comboData) ? comboData.slice(0,3) : []);
          console.log('Banners set to state:', bannerData);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);
  const firstTypeId = useMemo(() => (types && types.length > 0 ? types[0].MaLoaiMonAn : null), [types]);

  return (
    <>
      {/* TOP BANNER (Compact 3.5:1) */}
      <section className={styles.bannerSection}>
        <Container fluid className="px-0">
          <div className={`${styles.bannerWrap} ${styles.bannerCarousel}`}>
            {banners.length > 0 ? (
              <Carousel interval={3500} controls indicators fade pause="hover" touch wrap>
                {banners.map((banner, idx) => {
                  const imageUrl = `${import.meta.env.VITE_API_BASE_URL}${banner.AnhBanner}`;
                  console.log(`Banner ${idx + 1}:`, banner);
                  console.log(`Image URL: ${imageUrl}`);
                  return (
                    <Carousel.Item key={idx}>
                      <div 
                        className={styles.bannerFrame} 
                        onClick={() => banner.DuongDan && navigate(banner.DuongDan)}
                        style={{ cursor: banner.DuongDan ? 'pointer' : 'default' }}
                      >
                        <img
                          src={imageUrl}
                          alt={`Banner ${idx + 1}`}
                          loading="lazy"
                          onError={(e)=>{ try { e.currentTarget.onerror=null; e.currentTarget.src='/placeholder.svg'; } catch{} }}
                        />
                      </div>
                    </Carousel.Item>
                  );
                })}
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
                <h2>
                  <span className={styles.emoji}>🍕</span>{' '}
                  <span className={styles.gradientText}>Pizza nóng hổi, giao siêu tốc 30 phút</span>
                </h2>
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

      {/* QUICK EXPLORE */}
      <section className={styles.quickExploreSection}>
        <Container>
          <Row className="align-items-center g-3">
            <Col md={3} sm={12}>
              <h5 className={styles.quickExploreTitle + ' mb-0'}>
                <span>🔍</span> Khám phá nhanh
              </h5>
            </Col>
            <Col md={9} sm={12}>
              <div className="d-flex flex-wrap gap-2">
                {types.slice(0, 6).map(t => (
                  <Link 
                    key={t.MaLoaiMonAn} 
                    to={`/menu?type=${t.MaLoaiMonAn}`}
                    className={styles.quickExploreBtn}
                  >
                    <span>{t.TenLoaiMonAn}</span>
                  </Link>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* BEST SELLING FOODS - Món bán chạy nhất */}
      <section id="best-selling" className="py-4" style={{ background: '#fff' }}>
        <Container>
          <div className="mb-4">
            <h2 className={styles.sectionTitle}>Bán chạy nhất</h2>
            <p className="text-muted" style={{ marginTop: '0.75rem' }}>Top món được đặt nhiều nhất - Đừng bỏ lỡ!</p>
          </div>
          {loading ? (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Col key={i}>
                  <div className={styles.skeletonCard}>
                    <div className="ratio ratio-4x3 skeleton mb-3"></div>
                    <div className="skeleton" style={{ height: 16, width: '70%', borderRadius: 8 }}></div>
                    <div className="skeleton mt-2" style={{ height: 14, width: '50%', borderRadius: 8 }}></div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : bestSellingFoods.length > 0 ? (
            <>
              <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {bestSellingFoods.map(item => (
                  <Col key={item.MaMonAn}>
                    <ProductCard pizza={item} />
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-5">
                <Link to="/menu" className="btn btn-danger btn-lg px-5">
                  Xem tất cả món ăn →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">Chưa có dữ liệu món bán chạy</p>
            </div>
          )}
        </Container>
      </section>

      {/* FEATURED FOODS - Món đề xuất (unified background) */}
      <section id="featured" className="py-4" style={{ background: '#fff' }}>
        <Container>
          <div className="mb-4">
            <h2 className={styles.sectionTitle}>Món đặc biệt</h2>
            <p className="text-muted" style={{ marginTop: '0.75rem' }}>Được chọn lọc kỹ càng bởi đầu bếp chuyên nghiệp</p>
          </div>
          {loading ? (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Col key={i}>
                  <div className={styles.skeletonCard}>
                    <div className="ratio ratio-4x3 skeleton mb-3"></div>
                    <div className="skeleton" style={{ height: 16, width: '70%', borderRadius: 8 }}></div>
                    <div className="skeleton mt-2" style={{ height: 14, width: '50%', borderRadius: 8 }}></div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : featuredFoods.length > 0 ? (
            <>
              <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {featuredFoods.map(item => (
                  <Col key={item.MaMonAn}>
                    <ProductCard pizza={item} />
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-5">
                <Link to="/menu" className="btn btn-outline-danger btn-lg px-5">
                  Khám phá thực đơn →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">Chưa có món được đề xuất</p>
            </div>
          )}
        </Container>
      </section>

      {/* PROMO HIGHLIGHTS - Combo tiết kiệm (moved before stats) */}
      {combos.length > 0 && (
        <section className={styles.promoSection}>
          <Container>
            <div className="mb-4">
              <h2 className={styles.sectionTitle}>Combo tiết kiệm</h2>
              <p className="text-muted" style={{ marginTop: '0.75rem' }}>Chọn nhanh combo yêu thích & nhận ngay ưu đãi</p>
            </div>
            <Row className="g-4">
              {combos.map(cb => {
                const raw = cb.HinhAnh;
                const img = raw ? (String(raw).startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL}${raw}` : `${import.meta.env.VITE_API_BASE_URL}/images/AnhCombo/${raw}`) : '/placeholder.svg';
                return (
                  <Col md={4} key={cb.MaCombo}>
                    <Link to={`/combos/${cb.MaCombo}`} className={styles.promoCard}>
                      <img src={img} alt={cb.TenCombo} className={styles.promoImage} loading="lazy" />
                      <div className={styles.promoBadge}>COMBO</div>
                      <div className={styles.promoTitle}>{cb.TenCombo}</div>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </section>
      )}

      {/* STATS / CTA */}
      <section className="py-4" style={{ background: '#fff' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className={styles.sectionTitle} style={{ fontSize: '2rem', fontWeight: '700' }}>
              Tại sao chọn Secret Pizza?
            </h2>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>
              Hơn cả một bữa ăn - Trải nghiệm pizza đích thực
            </p>
          </div>
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className="text-center p-4 h-100">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ff4d4f', marginBottom: '0.5rem' }}>30'</div>
                <div className="fw-semibold" style={{ color: '#6c757d' }}>Giao hàng nhanh</div>
                <p className="small text-muted mb-0 mt-2">Nóng hổi tận nhà</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="text-center p-4 h-100">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍕</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ff4d4f', marginBottom: '0.5rem' }}>50+</div>
                <div className="fw-semibold" style={{ color: '#6c757d' }}>Món ăn đa dạng</div>
                <p className="small text-muted mb-0 mt-2">Phong phú lựa chọn</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="text-center p-4 h-100">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ff4d4f', marginBottom: '0.5rem' }}>100%</div>
                <div className="fw-semibold" style={{ color: '#6c757d' }}>Nguyên liệu tươi</div>
                <p className="small text-muted mb-0 mt-2">Chất lượng đảm bảo</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="text-center p-4 h-100">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏰</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ff4d4f', marginBottom: '0.5rem' }}>24/7</div>
                <div className="fw-semibold" style={{ color: '#6c757d' }}>Đặt món online</div>
                <p className="small text-muted mb-0 mt-2">Tiện lợi mọi lúc</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomePage;
