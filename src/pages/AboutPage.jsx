import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { fetchBranches } from '../services/api';
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
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchBranches();
        if (mounted) {
          setBranches(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load branches:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (sdkReady) {
      window.goongjs.accessToken = GOONG_API_KEY;
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
      if (window.goongjs) {
        window.goongjs.accessToken = GOONG_API_KEY;
        setSdkReady(true);
      }
    };

    const existingScript = document.querySelector('script[data-goong-js]');
    if (existingScript) {
      existingScript.addEventListener('load', handleLoad);
      return () => existingScript.removeEventListener('load', handleLoad);
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js';
    script.async = true;
    script.setAttribute('data-goong-js', 'true');
    script.addEventListener('load', handleLoad);
    script.addEventListener('error', () => console.error('Failed to load Goong Maps SDK'));
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
    };
  }, [sdkReady]);

  useEffect(() => {
    if (!sdkReady || !mapRef.current || mapInstanceRef.current) return;

    const map = new window.goongjs.Map({
      container: mapRef.current,
      style: 'https://tiles.goong.io/assets/goong_map_web.json',
      center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
      zoom: DEFAULT_ZOOM
    });

    mapInstanceRef.current = map;
    setMapLoaded(false);

    const handleLoad = () => {
      setMapLoaded(true);
    };

    map.on('load', handleLoad);

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

  return (
    <>
      {/* Hero */}
      <section className={styles.aboutHero}>
        <Container>
          <div className="text-center">
            <h1 className={styles.heroTitle}>Về Secret Pizza</h1>
            <p className={styles.heroSubtitle}>
              Hành trình mang pizza Ý chính gốc đến mọi nhà - Nhanh chóng, Tươi ngon, Đậm đà
            </p>
          </div>
        </Container>
      </section>

      {/* Story Section */}
      <section className={styles.storySection}>
        <Container>
          <Row className="gy-4">
            <Col md={4}>
              <Card className={styles.storyCard}>
                <div className={styles.storyIcon}>🍕</div>
                <h3>Câu chuyện</h3>
                <p>
                  Secret Pizza ra đời từ đam mê mang pizza tươi ngon, nóng hổi đến tay khách hàng. 
                  Chúng tôi chọn lọc nguyên liệu mỗi ngày, kết hợp công thức độc quyền để tạo nên hương vị khác biệt.
                </p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className={styles.storyCard}>
                <div className={styles.storyIcon}>🎯</div>
                <h3>Sứ mệnh</h3>
                <p>
                  Đơn giản hóa việc đặt món - vài cú chạm là có ngay bữa ăn chất lượng. 
                  Cam kết giao hàng siêu tốc 30 phút với nguyên liệu 100% tươi mới.
                </p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className={styles.storyCard}>
                <div className={styles.storyIcon}>💎</div>
                <h3>Giá trị</h3>
                <p>
                  Chất lượng - Tốc độ - Uy tín. Mỗi chiếc pizza là một lời cam kết về sự hoàn hảo, 
                  từ nguyên liệu đến cách phục vụ.
                </p>
              </Card>
            </Col>
          </Row>
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
                {!mapLoaded && (
                  <div className={styles.mapPlaceholder}>
                    <Spinner animation="border" variant="danger" />
                  </div>
                )}
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
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Container>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <Container>
          <h2 className="text-center mb-5 fw-bold">Cam kết của chúng tôi</h2>
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>🌿</div>
                <h4>Nguyên liệu tươi</h4>
                <p>100% tươi mỗi ngày, không chất bảo quản</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>⚡</div>
                <h4>Giao nhanh 30'</h4>
                <p>Cam kết giao hàng trong 30 phút</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>🎁</div>
                <h4>Ưu đãi hấp dẫn</h4>
                <p>Chương trình khuyến mãi mỗi tuần</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>⭐</div>
                <h4>Đánh giá 4.8/5</h4>
                <p>Hàng nghìn khách hàng hài lòng</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AboutPage;
