import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Modal } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { assetUrl, fetchFoods, fetchVariants, fetchOptionPrices, fetchCrusts, api } from '../services/api';

const CartPage = () => {
  const { items, subtotal, remove, setQty, clear, add } = useCart();
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [foods, setFoods] = useState([]);
  const [variants, setVariants] = useState([]);
  const [optionPrices, setOptionPrices] = useState([]);
  const [crusts, setCrusts] = useState([]);

  // Editing modal state
  const [editingItem, setEditingItem] = useState(null); // existing cart item object
  const [editorFood, setEditorFood] = useState(null); // full food detail from API
  const [editorLoading, setEditorLoading] = useState(false);
  const [sizeId, setSizeId] = useState(null);
  const [crustId, setCrustId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({}); // { MaTuyChon: boolean }
  const [editQty, setEditQty] = useState(1);
  const [saveBusy, setSaveBusy] = useState(false);
  const [editorError, setEditorError] = useState('');

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

  // Helpers replicating product detail logic
  function variantPrice(variant) {
    const v = variant?.GiaBan;
    return v ? Number(v) : 0;
  }

  function optionExtraForSize(option, sizeId) {
    const price = option?.TuyChon_Gia?.find(g => g.Size?.MaSize === sizeId)?.GiaThem;
    return price ? Number(price) : 0;
  }

  const openEditor = async (cartItem) => {
    if (!cartItem) return;
    setEditingItem(cartItem);
    setEditorFood(null);
    setEditorLoading(true);
    setEditorError('');
    setSizeId(null);
    setCrustId(cartItem.deBanhId ?? null);
    setSelectedOptions({});
    setEditQty(cartItem.soLuong || 1);
    try {
      const res = await api.get(`/api/foods/${cartItem.monAnId}`);
      const food = res.data;
      setEditorFood(food);
      // sizes list from variants
      const variants = food?.BienTheMonAn || [];
      const sizes = variants.map(v => v.Size).filter(Boolean);
      // determine sizeId from bienTheId if present
      if (cartItem.bienTheId != null) {
        const matchedVariant = variants.find(v => v.MaBienThe === cartItem.bienTheId);
        if (matchedVariant?.Size?.MaSize != null) setSizeId(matchedVariant.Size.MaSize);
      } else if (sizes.length) {
        setSizeId(sizes[0].MaSize);
      }
      // preselect options
      const optMap = {};
      (cartItem.tuyChonThem || []).forEach(id => { optMap[id] = true; });
      setSelectedOptions(optMap);
    } catch (err) {
      setEditorError('Không tải được dữ liệu món để sửa.');
    } finally {
      setEditorLoading(false);
    }
  };

  const closeEditor = () => {
    if (saveBusy) return; // block closing while saving
    setEditingItem(null);
    setEditorFood(null);
    setSelectedOptions({});
    setEditorError('');
  };

  const toggleOption = (id) => {
    setSelectedOptions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Compute dynamic pricing in editor
  const editorVariants = editorFood?.BienTheMonAn || [];
  const editorSizes = editorVariants.map(v => v.Size).filter(Boolean);
  const editorCrusts = (editorFood?.MonAn_DeBanh || []).map(mdb => mdb.DeBanh) || [];
  const baseVariant = editorVariants.find(v => v.Size?.MaSize === sizeId) || null;
  const basePrice = variantPrice(baseVariant);
  const optionsExtra = useMemo(() => {
    const ids = Object.keys(selectedOptions).filter(k => selectedOptions[k]);
    return ids.reduce((sum, idStr) => {
      const idNum = Number(idStr);
      const list = (editorFood?.MonAn_TuyChon || []).map(mt => mt.TuyChon);
      const opt = list.find(o => o.MaTuyChon === idNum);
      return sum + optionExtraForSize(opt, sizeId);
    }, 0);
  }, [selectedOptions, editorFood, sizeId]);
  const editorTotal = (basePrice + optionsExtra) * editQty;

  const groupedEditorOptions = useMemo(() => {
    const list = (editorFood?.MonAn_TuyChon || []).map(mt => mt.TuyChon);
    const groups = {};
    list.forEach(opt => {
      const key = opt?.LoaiTuyChon?.TenLoaiTuyChon || 'Khác';
      if (!groups[key]) groups[key] = [];
      groups[key].push(opt);
    });
    return groups;
  }, [editorFood]);

  const saveEditedItem = async () => {
    if (!editingItem || !editorFood) return;
    setSaveBusy(true);
    try {
      // Remove old item first
      remove(editingItem.key);
      const optIds = Object.keys(selectedOptions).filter(k => selectedOptions[k]).map(Number);
      const sizeName = baseVariant?.Size?.TenSize || null;
      const crust = editorCrusts.find(c => c.MaDeBanh === crustId);
      const crustName = crust ? crust.TenDeBanh : null;
      const allOpts = (editorFood?.MonAn_TuyChon || []).map(mt => mt.TuyChon);
      const optionsDetail = optIds.map(idNum => {
        const o = allOpts.find(x => x.MaTuyChon === idNum);
        return o ? { id: idNum, name: o.TenTuyChon, extra: optionExtraForSize(o, sizeId) } : { id: idNum, name: `Tùy chọn #${idNum}`, extra: 0 };
      });
      const imageUrl = (() => {
        if (!editorFood?.HinhAnh) return '/placeholder.svg';
        const raw = String(editorFood.HinhAnh);
        const path = raw.startsWith('/') ? raw : `/images/AnhMonAn/${raw}`;
        return assetUrl(path);
      })();
      const newItem = {
        monAnId: editorFood.MaMonAn,
        bienTheId: baseVariant?.MaBienThe ?? null,
        soLuong: editQty,
        deBanhId: crustId ?? null,
        tuyChonThem: optIds,
        unitPrice: basePrice + optionsExtra,
        name: editorFood.TenMonAn,
        image: imageUrl,
        sizeName,
        crustName,
        optionsDetail,
      };
      add(newItem);
      closeEditor();
    } catch (err) {
      setEditorError('Không thể lưu thay đổi.');
    } finally {
      setSaveBusy(false);
    }
  };

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
                              <Button variant="outline-primary" size="sm" onClick={() => openEditor(item)}>Sửa</Button>
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
      {/* Edit Item Modal */}
      <Modal show={!!editingItem} onHide={closeEditor} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Sửa sản phẩm trong giỏ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editorLoading && (
            <div className="d-flex align-items-center gap-2"><Spinner animation="border" size="sm" /> Đang tải dữ liệu...</div>
          )}
          {!editorLoading && editorError && (
            <div className="alert alert-danger py-2 small mb-2">{editorError}</div>
          )}
          {!editorLoading && editorFood && (
            <div className="d-flex flex-column gap-4">
              <div className="d-flex gap-3">
                <div style={{ width: 140, height: 140 }} className="rounded overflow-hidden bg-light flex-shrink-0">
                  {(() => {
                    const raw = editorFood?.HinhAnh;
                    if (!raw) return <div className="text-muted small d-flex align-items-center justify-content-center h-100">No image</div>;
                    const path = String(raw).startsWith('/') ? String(raw) : `/images/AnhMonAn/${raw}`;
                    return <img src={assetUrl(path)} alt={editorFood.TenMonAn} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
                  })()}
                </div>
                <div className="flex-grow-1">
                  <h5 className="mb-2">{editorFood.TenMonAn}</h5>
                  <div className="text-muted small">Chỉnh sửa kích thước, đế, tùy chọn và số lượng.</div>
                </div>
              </div>

              {/* Size selection */}
              {editorSizes.length > 0 && (
                <div>
                  <div className="fw-semibold mb-2">Kích thước</div>
                  <div className="d-flex flex-wrap gap-2">
                    {editorSizes.map(s => {
                      const variant = editorVariants.find(v => v.Size?.MaSize === s.MaSize);
                      const price = variantPrice(variant);
                      const active = sizeId === s.MaSize;
                      return (
                        <Button key={s.MaSize} variant={active ? 'danger' : 'outline-secondary'} size="sm" onClick={() => setSizeId(s.MaSize)}>
                          {s.TenSize}{price > 0 && ` (${price.toLocaleString()} đ)`}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Crust selection */}
              {editorCrusts.length > 0 && (
                <div>
                  <div className="fw-semibold mb-2">Đế bánh</div>
                  <div className="d-flex flex-wrap gap-2">
                    {editorCrusts.map(c => (
                      <Button key={c.MaDeBanh} variant={crustId === c.MaDeBanh ? 'danger' : 'outline-secondary'} size="sm" onClick={() => setCrustId(c.MaDeBanh)}>
                        {c.TenDeBanh}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Options */}
              {Object.keys(groupedEditorOptions).length > 0 && (
                <div>
                  <div className="fw-semibold mb-2">Tùy chọn thêm</div>
                  {Object.entries(groupedEditorOptions).map(([group, opts]) => (
                    <div key={group} className="mb-3">
                      <div className="small text-uppercase text-muted mb-1">{group}</div>
                      <div className="d-flex flex-column gap-1">
                        {opts.map(o => {
                          const extra = optionExtraForSize(o, sizeId);
                          const checked = !!selectedOptions[o.MaTuyChon];
                          return (
                            <div key={o.MaTuyChon} className={`d-flex justify-content-between align-items-center px-2 py-1 rounded border ${checked ? 'border-danger bg-light' : 'border-secondary'}`} style={{ cursor: 'pointer' }} onClick={() => toggleOption(o.MaTuyChon)}>
                              <div className="d-flex align-items-center gap-2">
                                <div style={{ width: 18, height: 18 }} className={`rounded border d-flex align-items-center justify-content-center ${checked ? 'bg-danger text-white' : ''}`}>{checked ? '✓' : ''}</div>
                                <span className="small">{o.TenTuyChon}</span>
                              </div>
                              {extra > 0 && <span className="small text-muted">+{extra.toLocaleString()} đ</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity & Total */}
              <div className="d-flex justify-content-between align-items-center mt-2">
                <div className="d-inline-flex align-items-center border rounded overflow-hidden">
                  <Button variant="light" className="px-2" onClick={() => setEditQty(Math.max(1, editQty - 1))}>−</Button>
                  <Form.Control value={editQty} onChange={(e) => setEditQty(Math.max(1, Number(e.target.value || 1)))} type="number" min={1} style={{ width: 64, textAlign: 'center', border: 0, boxShadow: 'none' }} />
                  <Button variant="light" className="px-2" onClick={() => setEditQty(editQty + 1)}>+</Button>
                </div>
                <div className="text-end">
                  <div className="fw-semibold">{editorTotal.toLocaleString()} đ</div>
                  <div className="small text-muted">Tổng tạm tính</div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditor} disabled={saveBusy}>Hủy</Button>
          <Button variant="danger" onClick={saveEditedItem} disabled={saveBusy || editorLoading || !editorFood}>Lưu thay đổi</Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default CartPage;
