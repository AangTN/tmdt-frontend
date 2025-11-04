import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import OrderDetail from '../components/ui/OrderDetail';

const TrackOrderPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);

  // User order list
  const [orders, setOrders] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState('');

  // Modal detail
  const [selectedId, setSelectedId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const formatVnd = (n) => Number(n || 0).toLocaleString() + ' đ';

  // timeline is handled inside OrderDetail component

  useEffect(() => {
    let active = true;
    (async () => {
      if (!isAuthenticated || !user?.maNguoiDung) {
        setOrders([]);
        setListError('');
        return;
      }
      setListLoading(true);
      setListError('');
      try {
        const res = await api.get(`/api/orders/user/${user.maNguoiDung}`);
        const data = res.data?.data;
        if (!active) return;
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) return;
        setListError(err?.response?.data?.message || err.message || 'Không tải được danh sách đơn hàng');
      } finally {
        if (active) setListLoading(false);
      }
    })();
    return () => { active = false; };
  }, [isAuthenticated, user?.maNguoiDung]);

  const getLastStatus = (o) => {
    if (!o || !Array.isArray(o.LichSuTrangThaiDonHang) || o.LichSuTrangThaiDonHang.length === 0) return null;
    try {
      const sorted = [...o.LichSuTrangThaiDonHang].sort((a, b) => new Date(a.ThoiGianCapNhat) - new Date(b.ThoiGianCapNhat));
      return sorted[sorted.length - 1].TrangThai;
    } catch (e) {
      return o.LichSuTrangThaiDonHang[o.LichSuTrangThaiDonHang.length - 1].TrangThai;
    }
  };

  const openDetail = (orderId) => {
    if (!orderId) return;
    setSelectedId(orderId);
    setShowDetail(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const id = String(code || '').trim();
    if (!id) return;
    setResult(null);
    openDetail(id);
  };

  return (
    <section className="py-4">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="p-3">
              <h4 className="mb-3">Theo dõi đơn hàng</h4>

              {isAuthenticated ? (
                <>
                  <div className="mb-3 fw-semibold">Đơn hàng của bạn</div>
                  {listLoading && (
                    <div className="text-muted small mb-2 d-flex align-items-center gap-2">
                      <Spinner animation="border" size="sm" /> Đang tải danh sách...
                    </div>
                  )}
                  {listError && <Alert variant="danger" className="py-2 px-3 small">{listError}</Alert>}
                  {!listLoading && !listError && orders.length === 0 && (
                    <div className="text-muted small">Bạn chưa có đơn hàng nào.</div>
                  )}
                  {orders.length > 0 && (
                    <div className="d-flex flex-column gap-2">
                      {orders.map(o => {
                        const lastStatus = getLastStatus(o);
                        const statusLower = (lastStatus || '').toLowerCase();
                        const badgeVariant = statusLower.includes('hủy') ? 'danger' : (statusLower.includes('đã') || statusLower.includes('hoàn') ? 'success' : 'warning');
                        return (
                        <div key={o.MaDonHang} className="border rounded p-3 d-flex justify-content-between align-items-center">
                          <div className="small">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="fw-semibold">Đơn #{o.MaDonHang}</span>
                              <Badge bg={badgeVariant}>{lastStatus || (o?.ThanhToan?.TrangThai || 'Pending')}</Badge>
                            </div>
                            <div className="text-muted">{new Date(o.NgayDat).toLocaleString()}</div>
                            <div className="mt-1"><strong>Tổng:</strong> {formatVnd(o.TongTien)} • <strong>Phương thức:</strong> {o?.ThanhToan?.PhuongThuc || 'N/A'}</div>
                          </div>
                          <div>
                            <Button size="sm" variant="outline-primary" onClick={() => openDetail(o.MaDonHang)}>Xem chi tiết</Button>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Form onSubmit={onSubmit} className="d-flex gap-2">
                    <Form.Control placeholder="Nhập mã đơn hàng" value={code} onChange={(e) => setCode(e.target.value)} required />
                    <Button variant="danger" type="submit">Tra cứu</Button>
                  </Form>
                </>
              )}

              <OrderDetail show={showDetail} onHide={() => setShowDetail(false)} orderId={selectedId} />
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TrackOrderPage;
