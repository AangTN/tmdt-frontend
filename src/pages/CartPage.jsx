import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { assetUrl, fetchFoods, fetchVariants, fetchOptionPrices, fetchCrusts } from '../services/api';

const CartPage = () => {
  const { items, subtotal, remove, setQty, clear } = useCart();
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [foods, setFoods] = useState([]);
  const [variants, setVariants] = useState([]);
  const [optionPrices, setOptionPrices] = useState([]);
  const [crusts, setCrusts] = useState([]);

  useEffect(() => {
    if (items.length === 0) return;
    let active = true;
    setLoadingDetails(true);
    setDetailsError('');
    (async () => {
      try {
        const [foodsData, variantsData, optionPricesData, crustsData] = await Promise.all([
          fetchFoods(),
          fetchVariants(),
          fetchOptionPrices(),
          fetchCrusts()
        ]);
        if (!active) return;
        setFoods(Array.isArray(foodsData) ? foodsData : []);
        setVariants(Array.isArray(variantsData) ? variantsData : []);
        setOptionPrices(Array.isArray(optionPricesData) ? optionPricesData : []);
        setCrusts(Array.isArray(crustsData) ? crustsData : []);
      } catch (err) {
        if (active) setDetailsError('Không tải được thông tin chi tiết giỏ hàng.');
      } finally {
        if (active) setLoadingDetails(false);
      }
    })();
    return () => { active = false; };
  }, [items.length]);

  const foodsMap = useMemo(() => {
    const map = new Map();
    foods.forEach(food => {
      if (food?.MaMonAn != null) map.set(food.MaMonAn, food);
    });
    return map;
  }, [foods]);

  const variantsMap = useMemo(() => {
    const map = new Map();
    variants.forEach(variant => {
      if (variant?.MaBienThe != null) map.set(variant.MaBienThe, variant);
    });
    return map;
  }, [variants]);

  const crustMap = useMemo(() => {
    const map = new Map();
    crusts.forEach(crust => {
      if (crust?.MaDeBanh != null) map.set(crust.MaDeBanh, crust);
    });
    return map;
  }, [crusts]);

  const optionPriceMap = useMemo(() => {
    const map = new Map();
    optionPrices.forEach(op => {
      if (op?.MaTuyChon == null) return;
      const sizeKey = op?.MaSize != null ? op.MaSize : 'null';
      map.set(`${op.MaTuyChon}|${sizeKey}`, op);
    });
    return map;
  }, [optionPrices]);

  const optionFallbackMap = useMemo(() => {
    const map = new Map();
    optionPrices.forEach(op => {
      if (op?.MaTuyChon != null && !map.has(op.MaTuyChon)) {
        map.set(op.MaTuyChon, op);
      }
    });
    return map;
  }, [optionPrices]);

  const enrichedItems = useMemo(() => {
    if (items.length === 0) return [];
    return items.map((item) => {
      const food = foodsMap.get(item.monAnId);
      const variant = item.bienTheId != null ? variantsMap.get(item.bienTheId) : null;
      const crust = item.deBanhId != null ? crustMap.get(item.deBanhId) : null;

      const sizeId = variant?.Size?.MaSize ?? null;
      const sizeName = variant?.Size?.TenSize || item.sizeName || null;
  const name = food?.TenMonAn || item.name || `Món #${item.monAnId}`;
  const rawImg = food?.HinhAnh;
  const imagePath = rawImg ? (String(rawImg).startsWith('/') ? String(rawImg) : `/images/AnhMonAn/${rawImg}`) : null;
  const image = imagePath ? assetUrl(imagePath) : item.image || '';

      const optionsDetail = Array.isArray(item.tuyChonThem)
        ? item.tuyChonThem.map((optId) => {
            const key = `${optId}|${sizeId ?? 'null'}`;
            const entry = optionPriceMap.get(key) || optionFallbackMap.get(optId) || null;
            const optionName = entry?.TuyChon?.TenTuyChon || `Tùy chọn #${optId}`;
            const extra = entry ? Number(entry.GiaThem || 0) : 0;
            const group = entry?.TuyChon?.LoaiTuyChon?.TenLoaiTuyChon || '';
            return { id: optId, name: optionName, extra, group };
          })
        : [];

      const extraSum = optionsDetail.reduce((sum, opt) => sum + Number(opt.extra || 0), 0);
      const basePrice = variant ? Number(variant.GiaBan || 0) : null;
      const computedUnitPrice = basePrice != null ? basePrice + extraSum : null;
      const displayUnitPrice = computedUnitPrice != null && !Number.isNaN(computedUnitPrice)
        ? computedUnitPrice
        : Number(item.unitPrice || 0);

      return {
        ...item,
        name,
        image,
        sizeName,
        crustName: crust?.TenDeBanh || item.crustName || null,
        optionsDetail,
        basePrice,
        extraSum,
        displayUnitPrice,
      };
    });
  }, [items, foodsMap, variantsMap, crustMap, optionPriceMap, optionFallbackMap]);

  const displaySubtotal = useMemo(() => {
    return enrichedItems.reduce((sum, item) => sum + Number(item.soLuong || 0) * Number(item.displayUnitPrice || 0), 0);
  }, [enrichedItems]);

  return (
    <section className="py-4">
      <Container>
        <h2 className="mb-3">Giỏ hàng</h2>
        {items.length === 0 ? (
          <div className="text-center text-muted py-5">
            Giỏ hàng trống. <Link to="/menu">Tiếp tục mua sắm</Link>
          </div>
        ) : (
          <Row className="g-4">
            <Col md={8}>
              {loadingDetails && (
                <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                  <Spinner animation="border" size="sm" /> Đang tải chi tiết từng sản phẩm...
                </div>
              )}
              {detailsError && (
                <div className="alert alert-warning py-2 small">{detailsError}</div>
              )}

              <div className="d-flex flex-column gap-3">
                {enrichedItems.map((item) => {
                  const segments = [];
                  if (item.sizeName) segments.push(`Size: ${item.sizeName}`);
                  if (item.crustName) segments.push(`Đế: ${item.crustName}`);
                  if (Array.isArray(item.optionsDetail) && item.optionsDetail.length > 0) {
                    const opts = item.optionsDetail
                      .map(o => `${o.name}${Number(o.extra) > 0 ? ` (+${Number(o.extra).toLocaleString()} đ)` : ''}`)
                      .join(', ');
                    segments.push(`Tùy chọn: ${opts}`);
                  }
                  const detailLine = segments.length > 0 ? segments.join(' • ') : '';
                  const unitPrice = Number(item.displayUnitPrice || 0);
                  const lineTotal = Number(item.soLuong || 0) * unitPrice;
                  return (
                    <Card key={item.key} className="p-3">
                      <div className="d-flex gap-3 align-items-start">
                        <div style={{ width: 96, height: 96 }} className="rounded overflow-hidden bg-light flex-shrink-0 d-flex align-items-center justify-content-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e)=>{ try { e.currentTarget.onerror=null; e.currentTarget.src='/placeholder.svg'; } catch{} }} />
                          ) : (
                            <div className="text-muted small">No image</div>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <div>
                              <div className="fw-semibold">{item.name}</div>
                              {detailLine && <div className="small text-muted">{detailLine}</div>}
                            </div>
                            <div className="text-end">
                              <div className="fw-semibold">{unitPrice.toLocaleString()} đ</div>
                              <div className="small text-muted">Đơn giá</div>
                            </div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <div className="d-inline-flex align-items-center border rounded overflow-hidden">
                              <Button variant="light" className="px-2" onClick={() => setQty(item.key, Math.max(1, Number(item.soLuong || 1) - 1))}>−</Button>
                              <Form.Control
                                value={item.soLuong}
                                onChange={(e) => setQty(item.key, Math.max(1, Number(e.target.value || 1)))}
                                type="number"
                                min={1}
                                style={{ width: 64, textAlign: 'center', border: 0, boxShadow: 'none' }}
                              />
                              <Button variant="light" className="px-2" onClick={() => setQty(item.key, Number(item.soLuong || 0) + 1)}>+</Button>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                              <div className="fw-semibold">{lineTotal.toLocaleString()} đ</div>
                              <Button variant="outline-danger" size="sm" onClick={() => remove(item.key)}>Xóa</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <Link to="/menu">
                  <Button variant="outline-primary">← Tiếp tục mua sắm</Button>
                </Link>
                <Button variant="outline-secondary" onClick={clear}>Xóa giỏ hàng</Button>
              </div>
            </Col>
            <Col md={4}>
              <Card className="p-3 sticky-top" style={{ top: 88 }}>
                <h5 className="mb-3">Tóm tắt đơn hàng</h5>
                <div className="d-flex justify-content-between small">
                  <span>Tạm tính</span>
                  <span className="fw-semibold">{displaySubtotal.toLocaleString()} đ</span>
                </div>
                <div className="d-flex justify-content-between small mt-2">
                  <span>Phí giao hàng</span>
                  <span className="text-muted">Tính ở bước sau</span>
                </div>
                <div className="border-top mt-3 pt-3 d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Tổng</span>
                  <span className="text-danger fw-bold fs-5">{displaySubtotal.toLocaleString()} đ</span>
                </div>
                <Link to="/checkout" className="mt-3 d-grid">
                  <Button variant="danger" size="lg">Thanh toán</Button>
                </Link>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
};

export default CartPage;
