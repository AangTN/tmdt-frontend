import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { fetchBranches, fetchBestSellingFoods, assetUrl } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import styles from './AboutPage.module.css';

const GOONG_API_KEY = import.meta.env.VITE_MAP_KEY || 'GwbEvplbZNagXL5wwjjKOuOZnonRgeMYi46NToda';
const DEFAULT_CENTER = { lng: 105.83991, lat: 21.028 };
const DEFAULT_ZOOM = 5;
const SINGLE_BRANCH_ZOOM = 13;

const AboutPage = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [sdkReady, setSdkReady] = useState(() => typeof window !== 'undefined' && !!window.goongjs);
  const [mapError, setMapError] = useState('');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  // Best selling foods for showcase (use same source as HomePage)
  const [bestSellingFoods, setBestSellingFoods] = useState([]);
  const [foodsLoading, setFoodsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchBranches();
        if (mounted) setBranches(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load branches:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Load best selling foods for showcase
  useEffect(() => {
    let mounted = true;
    (async () => {
      setFoodsLoading(true);
      try {
        const data = await fetchBestSellingFoods();
        if (mounted) setBestSellingFoods(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Load best selling foods failed', err);
      } finally {
        if (mounted) setFoodsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (sdkReady) {
      try {
        console.log('Goong SDK already present. Setting accessToken from env. key present?', !!GOONG_API_KEY);
        window.goongjs.accessToken = GOONG_API_KEY;
      } catch (err) {
        console.error('Failed to set goongjs.accessToken:', err);
        setMapError('Lỗi khi cấu hình map SDK');
      }
      return;
    }

    const cssId = 'goong-js-css';
    if (!document.getElementById(cssId)) {
      const cssLink = document.createElement('link');
      cssLink.id = cssId;
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css';
      document.head.appendChild(cssLink);
    }

    const handleLoad = () => {
      console.log('Goong SDK script loaded, window.goongjs:', !!window.goongjs, 'GOONG_API_KEY present?', !!GOONG_API_KEY);
      if (window.goongjs) {
        try {
          window.goongjs.accessToken = GOONG_API_KEY;
          setSdkReady(true);
        } catch (err) {
          console.error('Failed to set accessToken after SDK load:', err);
          setMapError('Lỗi khi cấu hình access token cho map');
        }
      } else {
        setMapError('SDK Goong không khả dụng sau khi tải');
      }
    };

    const existingScript = document.querySelector('script[data-goong-js]');
    if (existingScript) {
      existingScript.addEventListener('load', handleLoad);
      existingScript.addEventListener('error', () => {
        console.error('Existing Goong SDK script reported error');
        setMapError('Không thể tải SDK bản đồ (existing script)');
      });
      return () => {
        existingScript.removeEventListener('load', handleLoad);
        existingScript.removeEventListener('error', () => {});
      };
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js';
    script.async = true;
    script.setAttribute('data-goong-js', 'true');
    script.addEventListener('load', handleLoad);
    script.addEventListener('error', (e) => {
      console.error('Failed to load Goong Maps SDK', e);
      setMapError('Không thể tải SDK bản đồ');
    });
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
    };
  }, [sdkReady]);

  useEffect(() => {
    if (!sdkReady || !mapRef.current || mapInstanceRef.current) return;

    let map;
    try {
      console.log('Creating Goong map instance...');
      map = new window.goongjs.Map({
        container: mapRef.current,
        style: import.meta.env.VITE_MAP_STYLE || 'https://tiles.goong.io/assets/goong_map_web.json',
        center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
        zoom: DEFAULT_ZOOM
      });
    } catch (err) {
      console.error('Failed to create Goong map instance:', err);
      setMapError('Lỗi khi khởi tạo bản đồ: ' + (err.message || 'Unknown'));
      return;
    }

    mapInstanceRef.current = map;
    setMapLoaded(false);

    const handleLoad = () => {
      console.log('Goong map load event fired');
      setMapLoaded(true);
    };

    const handleError = (err) => {
      console.error('Goong map error event:', err);
      setMapError('Lỗi bản đồ: ' + (err && err.error ? err.error.message || err.error : JSON.stringify(err)));
    };

    map.on('load', handleLoad);
    map.on('error', handleError);

    return () => {
      map.off('load', handleLoad);
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.remove();
      mapInstanceRef.current = null;
      setMapLoaded(false);
    };
  }, [sdkReady]);

  useEffect(() => {
    if (!sdkReady || !mapInstanceRef.current || !window.goongjs) return;

    const map = mapInstanceRef.current;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const validBranches = branches.filter(branch => {
      const lng = Number(branch.KinhDo);
      const lat = Number(branch.ViDo);
      return Number.isFinite(lng) && Number.isFinite(lat);
    });

    if (validBranches.length === 0) {
      map.flyTo({ center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat], zoom: DEFAULT_ZOOM });
      return;
    }

    const bounds = new window.goongjs.LngLatBounds();

    validBranches.forEach(branch => {
      const lng = Number(branch.KinhDo);
      const lat = Number(branch.ViDo);

      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `
        background: #ff4d4f;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      `;

      const popup = new window.goongjs.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <h6 style="margin: 0 0 8px 0; color: #ff4d4f; font-weight: 700;">${branch.TenCoSo}</h6>
          <p style="margin: 4px 0; font-size: 0.9rem;"><strong>📍</strong> ${branch.SoNhaDuong}, ${branch.PhuongXa}</p>
          <p style="margin: 4px 0; font-size: 0.9rem;"><strong>📞</strong> ${branch.SoDienThoai}</p>
        </div>
      `);

      const marker = new window.goongjs.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([lng, lat]);
    });

    if (markersRef.current.length === 1) {
      const [lng, lat] = markersRef.current[0].getLngLat().toArray();
      map.flyTo({ center: [lng, lat], zoom: SINGLE_BRANCH_ZOOM });
    } else {
      map.fitBounds(bounds, { padding: 80, maxZoom: 14 });
    }
  }, [branches, sdkReady]);

  // For About page we will display bestSellingFoods directly using ProductCard (like HomePage)
  const bestSellers = useMemo(() => (Array.isArray(bestSellingFoods) ? bestSellingFoods.slice(0, 4) : []), [bestSellingFoods]);

  // Simple KPIs (static / could be dynamic later)
  const kpis = [
    { label: 'Pizza giao mỗi tháng', value: '12K+' },
    { label: 'Thành phần tươi mỗi ngày', value: '30+' },
    { label: 'Đánh giá trung bình', value: '4.8/5' },
    { label: 'Thời gian giao trung bình', value: '26 phút' }
  ];

  return (
    <>
      {/* Conversion Hero */}
      <section className={styles.aboutHero}>
        <Container>
          <Row className="align-items-center">
            <Col lg={7} className="text-center text-lg-start">
              <h1 className={styles.heroTitle}>Pizza nóng hổi – Giao siêu tốc</h1>
              <p className={styles.heroSubtitle}>
                Từ lò nướng đá chuẩn Ý đến bàn ăn của bạn chỉ trong vài chục phút. Chọn size, đế, tùy chọn thêm & tận hưởng!
              </p>
              <div className={styles.heroCTAGroup}>
                <Button href="/menu" variant="light" size="lg" className={styles.primaryCTA}>Đặt món ngay</Button>
                <Button href="#best-sellers" variant="outline-light" size="lg" className={styles.secondaryCTA}>Món nổi bật</Button>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              <div className={styles.heroVisual}>
                <div className={styles.heroBubbleOne}></div>
                <div className={styles.heroBubbleTwo}></div>
                <div className={styles.heroMockPizza}>🍕</div>
              </div>
            </Col>
          </Row>
          <Row className={styles.kpiRow}>
            {kpis.map(k => (
              <Col key={k.label} xs={6} md={3} className={styles.kpiCol}>
                <div className={styles.kpiCard}>
                  <div className={styles.kpiValue}>{k.value}</div>
                  <div className={styles.kpiLabel}>{k.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Delivery Area Notice */}
      <section className={styles.deliveryNotice}>
        <Container>
          <div className={styles.deliveryBanner}>
            <div className={styles.deliveryText}>
              <div className={styles.deliveryKicker}>Khu vực giao hàng</div>
              <h2>Hiện chỉ giao tại TP. Hồ Chí Minh & Hà Nội</h2>
              <p>Chúng tôi đang mở rộng hệ thống. Rất mong được phục vụ bạn sớm ở nhiều tỉnh thành khác!</p>
            </div>
            <div className={styles.deliveryCities}>
              <div className={styles.cityPill}>🏙️ TP. Hồ Chí Minh</div>
              <div className={styles.cityPill}>🛕 Hà Nội</div>
            </div>
          </div>
        </Container>
      </section>

      {/* USP / Why Choose Us */}
      <section className={styles.uspSection}>
        <Container>
          <Row className="gy-4">
            <Col md={3} sm={6}>
              <Card className={styles.uspCard}>
                <div className={styles.uspIcon}>🧀</div>
                <h3>Nguyên liệu chuẩn</h3>
                <p>Tươi mới mỗi ngày, phô mai & sốt nhập khẩu tuyển chọn.</p>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className={styles.uspCard}>
                <div className={styles.uspIcon}>⚡</div>
                <h3>Giao cực nhanh</h3>
                <p>Theo dõi trạng thái & thời gian dự kiến đến phút.</p>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className={styles.uspCard}>
                <div className={styles.uspIcon}>🛠️</div>
                <h3>Tùy biến linh hoạt</h3>
                <p>Chọn size, đế, thêm topping theo khẩu vị của bạn.</p>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className={styles.uspCard}>
                <div className={styles.uspIcon}>🎁</div>
                <h3>Ưu đãi đều đặn</h3>
                <p>Voucher & combo tiết kiệm chi phí mỗi tuần.</p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Best Sellers */}
      <section id="best-sellers" className={styles.bestSection}>
        <Container>
          <div className="text-center mb-4">
            <h2 className={styles.bestTitle}>Món được đặt nhiều</h2>
            <p className={styles.bestSubtitle}>Thử ngay những lựa chọn làm khách hàng quay lại thường xuyên</p>
          </div>
          {foodsLoading ? (
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
          ) : bestSellers.length > 0 ? (
            <>
              <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {bestSellers.map(item => (
                  <Col key={item.MaMonAn || item.id}>
                    <ProductCard pizza={item} />
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-4">
                <Button href="/menu" variant="danger" size="lg">Xem tất cả món ăn →</Button>
              </div>
            </>
          ) : (
            <div className="text-center text-muted py-4">Chưa có dữ liệu món ăn hiển thị.</div>
          )}
        </Container>
      </section>

      {/* Map & Branches */}
      <section className={styles.mapSection}>
        <Container>
          <h2 className={styles.mapTitle}>Hệ thống cửa hàng</h2>
          <p className={styles.mapSubtitle}>
            Ghé thăm cửa hàng gần bạn nhất để trải nghiệm không gian và hương vị độc đáo
          </p>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" />
              <p className="mt-3 text-muted">Đang tải thông tin cửa hàng...</p>
            </div>
          ) : (
            <>
              <div ref={mapRef} className={styles.mapContainer}>
                {mapError ? (
                  <div className="text-center text-danger p-4">
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Không thể hiển thị bản đồ</div>
                    <div className="small">{mapError}</div>
                    <div className="small text-muted mt-2">Mở DevTools → Console để xem log chi tiết.</div>
                  </div>
                ) : !mapLoaded ? (
                  <div className={styles.mapPlaceholder}>
                    <Spinner animation="border" variant="danger" />
                  </div>
                ) : null}
              </div>

              <Row className={`g-4 ${styles.branchesGrid}`}>
                {branches.map(branch => (
                  <Col key={branch.MaCoSo} md={12}>
                    <Card className={styles.branchCard}>
                      <h5>{branch.TenCoSo}</h5>
                      <div className={styles.info}>
                        <strong>📍 Địa chỉ:</strong> {branch.SoNhaDuong}, {branch.PhuongXa}, {branch.QuanHuyen}, {branch.ThanhPho}
                      </div>
                      <div className={styles.info}>
                        <strong>📞 Điện thoại:</strong> {branch.SoDienThoai}
                      </div>
                      {branch?.ThanhPho && (/Hà\s*Nội|Ha\s*Noi|Hồ\s*Chí\s*Minh|Ho\s*Chi\s*Minh|HCM/i).test(branch.ThanhPho) && (
                        <div className={styles.deliveryTag}>Phục vụ giao hàng</div>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Container>
      </section>

      {/* Values Section */}
      <section className={styles.testimonialSection}>
        <Container>
          <h2 className="text-center mb-4 fw-bold">Khách hàng nói gì?</h2>
          <Row className="g-4">
            <Col md={4}>
              <div className={styles.testimonialCard}>
                <div className={styles.quoteMark}>“</div>
                <p>Pizza sốt đậm đà, phô mai kéo cực đã. Giao nhanh hơn dự kiến!</p>
                <div className={styles.reviewer}>— Minh Anh</div>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles.testimonialCard}>
                <div className={styles.quoteMark}>“</div>
                <p>Rất thích phần chọn thêm topping, đúng kiểu cá nhân hóa khẩu vị.</p>
                <div className={styles.reviewer}>— Quốc Bảo</div>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles.testimonialCard}>
                <div className={styles.quoteMark}>“</div>
                <p>Dịch vụ ổn định, mình đặt nhiều lần vẫn nóng hổi & đúng giờ.</p>
                <div className={styles.reviewer}>— Linh Trang</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className={styles.finalCTA}>
        <Container className="text-center">
          <h2 className="fw-bold mb-3">Sẵn sàng thưởng thức chưa?</h2>
          <p className="text-muted mb-4">Khám phá thực đơn đa dạng & tự tạo chiếc pizza của riêng bạn.</p>
          <Button href="/menu" variant="danger" size="lg">Bắt đầu đặt món →</Button>
        </Container>
      </section>
    </>
  );
};

export default AboutPage;
