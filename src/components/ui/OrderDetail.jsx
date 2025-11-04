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
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{detail ? `Đơn #${detail.MaDonHang}` : 'Chi tiết đơn hàng'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <div className="fw-semibold mb-2">Thông tin giao hàng</div>
                    <div className="small">{detail.TenNguoiNhan} • {detail.SoDienThoaiGiaoHang}</div>
                    <div className="small text-muted">
                      {detail.SoNhaDuongGiaoHang}, {detail.PhuongXaGiaoHang}, {detail.QuanHuyenGiaoHang}, {detail.ThanhPhoGiaoHang}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <div className="fw-semibold mb-2">Thanh toán</div>
                    <div className="small">{detail?.ThanhToan?.PhuongThuc} • Trạng thái: {detail?.ThanhToan?.TrangThai}</div>
                    {detail?.CoSo && (
                      <div className="small mt-2">
                        <div className="fw-semibold">Cơ sở</div>
                        <div className="text-muted">{detail.CoSo.TenCoSo}</div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {Array.isArray(detail.ChiTietDonHang) && detail.ChiTietDonHang.length > 0 && (
              <div className="mt-4">
                <div className="fw-semibold mb-2">Sản phẩm</div>
                <div className="d-flex flex-column gap-2">
                  {detail.ChiTietDonHang.map(c => {
                    const name = c?.BienTheMonAn?.MonAn?.TenMonAn || `Món #${c?.BienTheMonAn?.MaMonAn || ''}`;
                    const size = c?.BienTheMonAn?.Size?.TenSize ? ` (${c.BienTheMonAn.Size.TenSize})` : '';
                    const crust = c?.DeBanh?.TenDeBanh ? ` • Đế: ${c.DeBanh.TenDeBanh}` : '';
                    const rawImg = c?.BienTheMonAn?.MonAn?.HinhAnh;
                    const imgPath = rawImg ? (String(rawImg).startsWith('/') ? String(rawImg) : `/images/AnhMonAn/${rawImg}`) : null;
                    const img = imgPath ? assetUrl(imgPath) : '/placeholder.svg';
                    const options = Array.isArray(c?.ChiTietDonHang_TuyChon) ? c.ChiTietDonHang_TuyChon : [];
                    return (
                      <div key={c.MaChiTiet} className="d-flex gap-3 border rounded p-2 align-items-center">
                        <div style={{ width: 80, height: 80 }} className="flex-shrink-0 rounded overflow-hidden bg-light d-flex align-items-center justify-content-center">
                          <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e)=>{ try { e.currentTarget.onerror=null; e.currentTarget.src='/placeholder.svg'; } catch{} }} />
                        </div>
                        <div className="flex-grow-1 small">
                          <div className="fw-semibold">{name}{size}{crust}</div>
                          {options.length > 0 && (
                            <div className="text-muted">Tùy chọn: {options.map(o => `${o?.TuyChon?.TenTuyChon || ('#'+o?.MaTuyChon)}${Number(o?.GiaThem)>0?` (+${formatVnd(o.GiaThem)})`:''}`).join(', ')}</div>
                          )}
                          <div className="mt-1">SL: {c.SoLuong} • Đơn giá: {formatVnd(c.DonGia)} • Thành tiền: {formatVnd(c.ThanhTien || (Number(c.DonGia||0)*Number(c.SoLuong||0)))}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {sortedHistory.length > 0 && (
              <div className="mt-4">
                <div className="fw-semibold mb-2">Tiến trình đơn hàng</div>
                <div className="d-flex flex-column">
                  {sortedHistory.map((h, idx) => {
                    const isLast = idx === sortedHistory.length - 1;
                    return (
                      <div key={h.MaLichSu || idx} className="d-flex position-relative ps-4 py-2">
                        <div className="position-absolute" style={{ left: 0, top: 10 }}>
                          <span style={{ width: 10, height: 10, display: 'inline-block', borderRadius: '50%', background: isLast ? '#16a34a' : '#9ca3af' }}></span>
                        </div>
                        {!isLast && (
                          <div className="position-absolute" style={{ left: 4, top: 22, bottom: -2, width: 2, background: '#e5e7eb' }} />
                        )}
                        <div>
                          <div className="small fw-semibold">{h.TrangThai}</div>
                          <div className="small text-muted">{new Date(h.ThoiGianCapNhat).toLocaleString()}</div>
                          {h.GhiChu && <div className="small">{h.GhiChu}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom totals summary */}
            <div className="mt-4 pt-3 border-top">
              <div className="d-flex justify-content-between small">
                <span className="text-muted">Tạm tính</span>
                <span>{formatVnd(detail.TienTruocGiamGia)}</span>
              </div>
              <div className="d-flex justify-content-between small mt-1">
                <span className="text-muted">Giảm giá</span>
                <span>-{formatVnd(detail.TienGiamGia)}</span>
              </div>
              <div className="d-flex justify-content-between small mt-1">
                <span className="text-muted">Phí ship</span>
                <span>{formatVnd(detail.PhiShip)}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <span className="fw-bold">Tổng thanh toán</span>
                <span className="text-danger fw-bold fs-4">{formatVnd(detail.TongTien)}</span>
              </div>
            </div>
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
