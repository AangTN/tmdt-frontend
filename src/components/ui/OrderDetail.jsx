import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Spinner, Alert, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { api, assetUrl } from '../../services/api';

function formatVnd(n) {
  return `${Number(n || 0).toLocaleString()} đ`;
}

export default function OrderDetail({ show, onHide, orderId, initialData = null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(initialData);
  const [canceling, setCanceling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');

  useEffect(() => {
    setError('');
    if (!show) return;
    if (!orderId && !initialData) {
      setDetail(null);
      return;
    }
    if (initialData) {
      setDetail(initialData);
      return;
    }
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/orders/${orderId}`);
        const data = res.data?.data || null;
        if (!active) return;
        setDetail(data);
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || err.message || 'Không tải được chi tiết đơn hàng');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, orderId]);

  const sortedHistory = useMemo(() => {
    if (!detail || !Array.isArray(detail?.LichSuTrangThaiDonHang)) return [];
    return [...detail.LichSuTrangThaiDonHang].sort((a, b) => new Date(a.ThoiGianCapNhat) - new Date(b.ThoiGianCapNhat));
  }, [detail]);

  const currentOrderStatus = useMemo(() => {
    if (!sortedHistory || sortedHistory.length === 0) return null;
    return sortedHistory[sortedHistory.length - 1].TrangThai;
  }, [sortedHistory]);

  const handleCancelOrder = async () => {
    if (!detail || !detail.MaDonHang) return;
    setCancelError('');
    setCancelSuccess('');
    setCanceling(true);
    try {
      const res = await api.post(`/api/orders/${detail.MaDonHang}/cancel`);
      if (res.status === 200) {
        setCancelSuccess(res.data?.message || 'Hủy đơn hàng thành công');
        // refetch detail
        try {
          const r2 = await api.get(`/api/orders/${detail.MaDonHang}`);
          const data = r2.data?.data || null;
          setDetail(data);
        } catch (e) {
          // ignore refetch error but show success
        }
      } else {
        setCancelError(res.data?.message || 'Không thể hủy đơn');
      }
    } catch (err) {
      setCancelError(err?.response?.data?.message || err.message || 'Hủy đơn thất bại');
    } finally {
      setCanceling(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered 
      scrollable
      style={{ zIndex: 1100 }}
    >
      <Modal.Header closeButton className="border-bottom bg-white sticky-top" style={{ zIndex: 1 }}>
        <Modal.Title>Đơn hàng #{detail?.MaDonHang || '...'}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }} className="bg-light">
        {loading && (
          <div className="text-muted small d-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" /> Đang tải chi tiết...
          </div>
        )}
  {error && <Alert variant="danger" className="py-2 px-3 small">{error}</Alert>}
  {cancelError && <Alert variant="danger" className="py-2 px-3 small">{cancelError}</Alert>}
  {cancelSuccess && <Alert variant="success" className="py-2 px-3 small">{cancelSuccess}</Alert>}
        {detail && (
          <div>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <div className="text-muted small">Đặt lúc {new Date(detail.NgayDat).toLocaleString()}</div>
                {detail.GhiChu && <div className="small">Ghi chú: {detail.GhiChu}</div>}
              </div>
              <div className="text-end small">
                <div className="mb-1">
                  {/* show final order status (last timeline entry) */}
                  <Badge bg={
                    (currentOrderStatus || '').toLowerCase().includes('hủy') ? 'danger' :
                    (currentOrderStatus || '').toLowerCase().includes('đã') || (currentOrderStatus || '').toLowerCase().includes('hoàn') ? 'success' :
                    'warning'
                  }>
                    {currentOrderStatus || detail?.ThanhToan?.TrangThai || 'Pending'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* determine current order status from history (last entry) */}
            

            <Row className="g-3">
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-danger bg-opacity-10 rounded-circle p-2 me-2">
                        <svg width="20" height="20" fill="#dc3545" viewBox="0 0 16 16">
                          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                        </svg>
                      </div>
                      <span className="fw-bold">Thông tin giao hàng</span>
                    </div>
                    <div className="mb-2">
                      <div className="small text-muted mb-1">Người nhận</div>
                      <div className="fw-semibold">{detail.TenNguoiNhan}</div>
                    </div>
                    <div className="mb-2">
                      <div className="small text-muted mb-1">Số điện thoại</div>
                      <div className="fw-semibold">{detail.SoDienThoaiGiaoHang}</div>
                    </div>
                    <div>
                      <div className="small text-muted mb-1">Địa chỉ</div>
                      <div className="small">
                        {detail.SoNhaDuongGiaoHang}, {detail.PhuongXaGiaoHang},<br/>
                        {detail.QuanHuyenGiaoHang}, {detail.ThanhPhoGiaoHang}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2">
                        <svg width="20" height="20" fill="#198754" viewBox="0 0 16 16">
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-2zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                        </svg>
                      </div>
                      <span className="fw-bold">Thanh toán</span>
                    </div>
                    <div className="mb-2">
                      <div className="small text-muted mb-1">Phương thức</div>
                      <div className="fw-semibold">{detail?.ThanhToan?.PhuongThuc || 'N/A'}</div>
                    </div>
                    <div className="mb-2">
                      <div className="small text-muted mb-1">Trạng thái</div>
                      <Badge bg={
                        detail?.ThanhToan?.TrangThai === 'Đã thanh toán' ? 'success' : 
                        detail?.ThanhToan?.TrangThai === 'Chưa thanh toán' ? 'warning' : 
                        'secondary'
                      } className="px-2 py-1">
                        {detail?.ThanhToan?.TrangThai || 'N/A'}
                      </Badge>
                    </div>
                    {detail?.CoSo && (
                      <div>
                        <div className="small text-muted mb-1">Cơ sở xử lý</div>
                        <div className="small fw-semibold">{detail.CoSo.TenCoSo}</div>
                        {detail.CoSo.SoDienThoai && (
                          <div className="small text-muted">{detail.CoSo.SoDienThoai}</div>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {Array.isArray(detail.ChiTietDonHang) && detail.ChiTietDonHang.length > 0 && (
              <div className="mt-4">
                <div className="fw-semibold mb-3">Sản phẩm đã đặt</div>
                <div className="d-flex flex-column gap-3">
                  {detail.ChiTietDonHang.map(c => {
                    const isCombo = c?.Loai === 'CB';
                    const comboDetails = Array.isArray(c?.ChiTietDonHang_ChiTietCombo) ? c.ChiTietDonHang_ChiTietCombo : [];
                    
                    // For combo, show combo info
                    if (isCombo && c?.Combo) {
                      const comboName = c.Combo.TenCombo;
                      const comboDesc = c.Combo.MoTa;
                      const rawImg = c.Combo.HinhAnh;
                      const imgPath = rawImg ? (String(rawImg).startsWith('/') ? String(rawImg) : `/images/AnhCombo/${rawImg}`) : null;
                      const img = imgPath ? assetUrl(imgPath) : '/placeholder.svg';
                      
                      return (
                        <Card key={c.MaChiTiet} className="border-0 shadow-sm">
                          <Card.Body className="p-3">
                            <div className="d-flex gap-3 align-items-start">
                              <div style={{ width: 100, height: 100 }} className="flex-shrink-0 rounded overflow-hidden bg-light">
                                <img src={img} alt={comboName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e)=>{ try { e.currentTarget.onerror=null; e.currentTarget.src='/placeholder.svg'; } catch{} }} />
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                  <Badge bg="danger" className="px-2">COMBO</Badge>
                                  <span className="fw-bold">{comboName}</span>
                                </div>
                                {comboDesc && <div className="small text-muted mb-2">{comboDesc}</div>}
                                
                                {/* Combo items */}
                                {comboDetails.length > 0 && (
                                  <div className="mt-2 ps-3 border-start border-danger border-3">
                                    <div className="small fw-semibold text-muted mb-2">Bao gồm:</div>
                                    {comboDetails.map((item, idx) => {
                                      const itemName = item?.BienTheMonAn?.MonAn?.TenMonAn || 'Món ăn';
                                      const itemSize = item?.BienTheMonAn?.Size?.TenSize || '';
                                      const itemCrust = item?.DeBanh?.TenDeBanh || '';
                                      return (
                                        <div key={idx} className="small mb-1 d-flex align-items-start">
                                          <span className="text-danger me-2">•</span>
                                          <span>
                                            <strong>{itemName}</strong>
                                            {itemSize && <span className="text-muted"> ({itemSize})</span>}
                                            {itemCrust && <span className="text-muted"> • Đế: {itemCrust}</span>}
                                            <span className="text-muted"> × {item.SoLuong || 1}</span>
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                
                                <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                                  <span className="small text-muted">Số lượng: {c.SoLuong}</span>
                                  <div className="text-end">
                                    <div className="small text-muted">Đơn giá: {formatVnd(c.DonGia)}</div>
                                    <div className="fw-bold text-danger">{formatVnd(c.ThanhTien)}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      );
                    }
                    
                    // For regular product
                    const name = c?.BienTheMonAn?.MonAn?.TenMonAn || `Món #${c?.BienTheMonAn?.MaMonAn || ''}`;
                    const size = c?.BienTheMonAn?.Size?.TenSize || '';
                    const crust = c?.DeBanh?.TenDeBanh || '';
                    const rawImg = c?.BienTheMonAn?.MonAn?.HinhAnh;
                    const imgPath = rawImg ? (String(rawImg).startsWith('/') ? String(rawImg) : `/images/AnhMonAn/${rawImg}`) : null;
                    const img = imgPath ? assetUrl(imgPath) : '/placeholder.svg';
                    const options = Array.isArray(c?.ChiTietDonHang_TuyChon) ? c.ChiTietDonHang_TuyChon : [];
                    
                    return (
                      <Card key={c.MaChiTiet} className="border-0 shadow-sm">
                        <Card.Body className="p-3">
                          <div className="d-flex gap-3 align-items-center">
                            <div style={{ width: 80, height: 80 }} className="flex-shrink-0 rounded overflow-hidden bg-light">
                              <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e)=>{ try { e.currentTarget.onerror=null; e.currentTarget.src='/placeholder.svg'; } catch{} }} />
                            </div>
                            <div className="flex-grow-1 small">
                              <div className="fw-bold mb-1">{name}</div>
                              {size && <div className="text-muted">Kích thước: {size}</div>}
                              {crust && <div className="text-muted">Đế bánh: {crust}</div>}
                              {options.length > 0 && (
                                <div className="text-muted mt-1">
                                  <span className="fw-semibold">Tùy chọn thêm:</span>{' '}
                                  {options.map((o, i) => (
                                    <span key={i}>
                                      {o?.TuyChon?.TenTuyChon || '#'+o?.MaTuyChon}
                                      {Number(o?.GiaThem) > 0 && <span> (+{formatVnd(o.GiaThem)})</span>}
                                      {i < options.length - 1 && ', '}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="mt-2 pt-2 border-top d-flex justify-content-between align-items-center">
                                <span className="text-muted">SL: {c.SoLuong}</span>
                                <div className="text-end">
                                  <div className="text-muted">{formatVnd(c.DonGia)} × {c.SoLuong}</div>
                                  <div className="fw-bold text-danger">{formatVnd(c.ThanhTien)}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {sortedHistory.length > 0 && (
              <div className="mt-4">
                <div className="fw-semibold mb-3">Lịch sử đơn hàng</div>
                <div className="d-flex flex-column">
                  {sortedHistory.map((h, idx) => {
                    const isLast = idx === sortedHistory.length - 1;
                    const isCancelled = (h.TrangThai || '').toLowerCase().includes('hủy');
                    const isCompleted = (h.TrangThai || '').toLowerCase().includes('hoàn thành') || (h.TrangThai || '').toLowerCase().includes('đã giao');
                    const dotColor = isCancelled ? '#dc3545' : isCompleted ? '#16a34a' : isLast ? '#dc3545' : '#9ca3af';
                    
                    return (
                      <div key={h.MaLichSu || idx} className="d-flex position-relative ps-4 py-2">
                        <div className="position-absolute" style={{ left: 0, top: 12 }}>
                          <span style={{ 
                            width: 12, 
                            height: 12, 
                            display: 'inline-block', 
                            borderRadius: '50%', 
                            background: dotColor,
                            border: isLast ? '3px solid rgba(220, 53, 69, 0.2)' : 'none',
                            boxShadow: isLast ? '0 0 0 4px rgba(220, 53, 69, 0.1)' : 'none'
                          }}></span>
                        </div>
                        {!isLast && (
                          <div className="position-absolute" style={{ left: 5, top: 26, bottom: -2, width: 2, background: '#e5e7eb' }} />
                        )}
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <div className="fw-semibold" style={{ color: isLast ? '#dc3545' : '#2c3e50' }}>{h.TrangThai}</div>
                              <div className="small text-muted">
                                {new Date(h.ThoiGianCapNhat).toLocaleDateString('vi-VN', { 
                                  year: 'numeric', 
                                  month: '2-digit', 
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                              {h.GhiChu && <div className="small mt-1">{h.GhiChu}</div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom totals summary */}
            <Card className="mt-4 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                    <svg width="20" height="20" fill="#0d6efd" viewBox="0 0 16 16">
                      <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                      <path d="M3 5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm2-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5z"/>
                    </svg>
                  </div>
                  <span className="fw-bold">Chi tiết thanh toán</span>
                </div>
                
                <div className="d-flex justify-content-between align-items-center py-2">
                  <span className="text-muted">Tạm tính</span>
                  <span className="fw-semibold">{formatVnd(detail.TienTruocGiamGia)}</span>
                </div>
                
                {Number(detail.TienGiamGia || 0) > 0 && (
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-success">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M2.5 8.5a.5.5 0 0 1 0-1h8.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L11.293 8.5H2.5z"/>
                        </svg>
                      </span>
                      <span className="text-success">Giảm giá</span>
                      {detail.Voucher && (
                        <Badge bg="success" className="small">{detail.Voucher.code || detail.Voucher.Code}</Badge>
                      )}
                    </div>
                    <span className="text-success fw-bold">-{formatVnd(detail.TienGiamGia)}</span>
                  </div>
                )}
                
                <div className="d-flex justify-content-between align-items-center py-2 mb-3 pb-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <svg width="16" height="16" fill="#6c757d" viewBox="0 0 16 16">
                      <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                    </svg>
                    <span className="text-muted">Phí giao hàng</span>
                  </div>
                  <span className="fw-semibold">{formatVnd(detail.PhiShip)}</span>
                </div>
                
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold fs-5">Tổng thanh toán</span>
                  <span className="text-danger fw-bold fs-3">{formatVnd(detail.TongTien)}</span>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </Modal.Body>
        <Modal.Footer>
        {detail && detail?.ThanhToan?.TrangThai === 'Chưa thanh toán' && currentOrderStatus === 'Đang chờ xác nhận' && (
          <Button variant="danger" onClick={handleCancelOrder} disabled={canceling}>
            {canceling ? 'Đang hủy…' : 'Hủy đơn'}
          </Button>
        )}
        <Button variant="secondary" onClick={onHide}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
}
