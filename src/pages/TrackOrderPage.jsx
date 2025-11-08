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
    const phone = String(code || '').trim();
    if (!phone) return;
    
    setResult({ loading: true });
    
    try {
      const res = await api.get(`/api/orders/phone/${phone}`);
      const data = res.data?.data;
      setResult({ 
        orders: Array.isArray(data) ? data : [],
        error: null 
      });
    } catch (err) {
      setResult({ 
        orders: [],
        error: err?.response?.data?.message || err.message || 'Không thể tra cứu đơn hàng'
      });
    }
  };

  return (
    <section className="py-4 bg-light min-vh-100">
      <Container>
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2">Theo dõi đơn hàng</h2>
          <p className="text-muted">Kiểm tra trạng thái và chi tiết đơn hàng của bạn</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={10}>
            {isAuthenticated ? (
              <>
                {/* User Orders List */}
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-danger bg-opacity-10 rounded-circle p-2 me-3">
                        <svg width="24" height="24" fill="#dc3545" viewBox="0 0 16 16">
                          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                      </div>
                      <div>
                        <h5 className="mb-0 fw-bold">Đơn hàng của bạn</h5>
                        <p className="text-muted small mb-0">
                          {orders.length > 0 ? `${orders.length} đơn hàng` : 'Chưa có đơn hàng'}
                        </p>
                      </div>
                    </div>

                    {listLoading && (
                      <div className="text-center py-4">
                        <Spinner animation="border" variant="danger" />
                        <div className="text-muted mt-2">Đang tải danh sách đơn hàng...</div>
                      </div>
                    )}

                    {listError && (
                      <Alert variant="danger" className="d-flex align-items-center">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                        {listError}
                      </Alert>
                    )}

                    {!listLoading && !listError && orders.length === 0 && (
                      <div className="text-center py-5">
                        <div className="mb-3">
                          <svg width="80" height="80" fill="#dee2e6" viewBox="0 0 16 16">
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                          </svg>
                        </div>
                        <h5 className="text-muted mb-3">Bạn chưa có đơn hàng nào</h5>
                        <p className="text-muted mb-3">Hãy đặt món ngay để trải nghiệm pizza ngon nhất!</p>
                        <Button variant="danger" href="/menu">
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                          </svg>
                          Đặt hàng ngay
                        </Button>
                      </div>
                    )}

                    {orders.length > 0 && (
                      <div className="d-flex flex-column gap-3">
                        {orders.map(o => {
                          const lastStatus = getLastStatus(o);
                          const statusLower = (lastStatus || '').toLowerCase();
                          const badgeVariant = statusLower.includes('hủy') ? 'danger' : (statusLower.includes('đã') || statusLower.includes('hoàn') ? 'success' : 'warning');
                          
                          return (
                            <Card key={o.MaDonHang} className="border-0 shadow-sm hover-lift" style={{ transition: 'transform 0.2s ease', cursor: 'pointer' }} onClick={() => openDetail(o.MaDonHang)}>
                              <Card.Body className="p-3">
                                <Row className="align-items-center">
                                  <Col md={3}>
                                    <div className="d-flex align-items-center gap-2">
                                      <div className="bg-danger bg-opacity-10 rounded-circle p-2">
                                        <svg width="20" height="20" fill="#dc3545" viewBox="0 0 16 16">
                                          <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                                          <path d="M3 5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 5zm0 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 7zm0 2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 3 9z"/>
                                        </svg>
                                      </div>
                                      <div className="fw-bold">Đơn #{o.MaDonHang}</div>
                                    </div>
                                  </Col>
                                  
                                  <Col md={3}>
                                    <div className="small">
                                      <div className="text-muted mb-1">Ngày đặt</div>
                                      <div className="fw-semibold">
                                        {new Date(o.NgayDat).toLocaleDateString('vi-VN', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric'
                                        })}
                                      </div>
                                    </div>
                                  </Col>

                                  <Col md={2}>
                                    <div className="small">
                                      <div className="text-muted mb-1">Trạng thái</div>
                                      <Badge bg={badgeVariant} className="px-2 py-1">
                                        {lastStatus || (o?.ThanhToan?.TrangThai || 'Pending')}
                                      </Badge>
                                    </div>
                                  </Col>

                                  <Col md={2}>
                                    <div className="small">
                                      <div className="text-muted mb-1">Tổng tiền</div>
                                      <div className="fw-bold text-danger">{formatVnd(o.TongTien)}</div>
                                    </div>
                                  </Col>

                                  <Col md={2} className="text-end">
                                    <Button size="sm" variant="outline-danger" className="rounded-pill">
                                      Xem chi tiết
                                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="ms-1">
                                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                      </svg>
                                    </Button>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </>
            ) : (
              <>
                {/* Guest Search by Phone */}
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-5 text-center">
                    <div className="mb-4">
                      <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-inline-flex">
                        <svg width="48" height="48" fill="#dc3545" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                      </div>
                    </div>
                    
                    <h4 className="fw-bold mb-3">Tra cứu đơn hàng</h4>
                    <p className="text-muted mb-4">
                      Nhập số điện thoại để kiểm tra tất cả đơn hàng của bạn
                    </p>

                    <Form onSubmit={onSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
                      <div className="d-flex gap-2">
                        <Form.Control 
                          type="tel"
                          placeholder="Nhập số điện thoại (VD: 0909123456)" 
                          value={code} 
                          onChange={(e) => setCode(e.target.value)} 
                          required 
                          size="lg"
                          className="shadow-sm"
                        />
                        <Button variant="danger" type="submit" size="lg" className="px-4">
                          <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                          </svg>
                          Tra cứu
                        </Button>
                      </div>
                    </Form>

                    <div className="mt-4 pt-4 border-top">
                      <p className="text-muted mb-3">Hoặc đăng nhập để xem tất cả đơn hàng của bạn</p>
                      <Button variant="outline-danger" href="/login" className="rounded-pill px-4">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                        </svg>
                        Đăng nhập ngay
                      </Button>
                    </div>
                  </Card.Body>
                </Card>

                {/* Guest orders result */}
                {result && (
                  <Card className="border-0 shadow-sm mt-4">
                    <Card.Body className="p-4">
                      {result.loading ? (
                        <div className="text-center py-4">
                          <Spinner animation="border" variant="danger" />
                          <div className="text-muted mt-2">Đang tìm kiếm đơn hàng...</div>
                        </div>
                      ) : (
                        <>
                          <div className="d-flex align-items-center mb-4">
                            <div className="bg-danger bg-opacity-10 rounded-circle p-2 me-3">
                              <svg width="24" height="24" fill="#dc3545" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                              </svg>
                            </div>
                            <div>
                              <h5 className="mb-0 fw-bold">Đơn hàng tìm thấy</h5>
                              <p className="text-muted small mb-0">
                                {result.orders?.length > 0 ? `${result.orders.length} đơn hàng` : 'Không có đơn hàng'}
                              </p>
                            </div>
                          </div>

                          {result.error && (
                        <Alert variant="danger" className="d-flex align-items-center">
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                          </svg>
                          {result.error}
                        </Alert>
                      )}

                      {!result.error && result.orders?.length === 0 && (
                        <div className="text-center py-5">
                          <div className="mb-3">
                            <svg width="80" height="80" fill="#dee2e6" viewBox="0 0 16 16">
                              <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                            </svg>
                          </div>
                          <h5 className="text-muted mb-3">Không tìm thấy đơn hàng</h5>
                          <p className="text-muted">Vui lòng kiểm tra lại số điện thoại</p>
                        </div>
                      )}

                      {result.orders && result.orders.length > 0 && (
                        <div className="d-flex flex-column gap-3">
                          {result.orders.map(o => {
                            const lastStatus = getLastStatus(o);
                            const statusLower = (lastStatus || '').toLowerCase();
                            const badgeVariant = statusLower.includes('hủy') ? 'danger' : (statusLower.includes('đã') || statusLower.includes('hoàn') ? 'success' : 'warning');
                            
                            return (
                              <Card key={o.MaDonHang} className="border-0 shadow-sm hover-lift" style={{ transition: 'transform 0.2s ease', cursor: 'pointer' }} onClick={() => openDetail(o.MaDonHang)}>
                                <Card.Body className="p-3">
                                  <Row className="align-items-center">
                                    <Col md={3}>
                                      <div className="d-flex align-items-center gap-2">
                                        <div className="bg-danger bg-opacity-10 rounded-circle p-2">
                                          <svg width="20" height="20" fill="#dc3545" viewBox="0 0 16 16">
                                            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                                            <path d="M3 5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 5zm0 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 7zm0 2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 3 9z"/>
                                          </svg>
                                        </div>
                                        <div className="fw-bold">Đơn #{o.MaDonHang}</div>
                                      </div>
                                    </Col>
                                    
                                    <Col md={3}>
                                      <div className="small">
                                        <div className="text-muted mb-1">Ngày đặt</div>
                                        <div className="fw-semibold">
                                          {new Date(o.NgayDat).toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                          })}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col md={2}>
                                      <div className="small">
                                        <div className="text-muted mb-1">Trạng thái</div>
                                        <Badge bg={badgeVariant} className="px-2 py-1">
                                          {lastStatus || (o?.ThanhToan?.TrangThai || 'Pending')}
                                        </Badge>
                                      </div>
                                    </Col>

                                    <Col md={2}>
                                      <div className="small">
                                        <div className="text-muted mb-1">Tổng tiền</div>
                                        <div className="fw-bold text-danger">{formatVnd(o.TongTien)}</div>
                                      </div>
                                    </Col>

                                    <Col md={2} className="text-end">
                                      <Button size="sm" variant="outline-danger" className="rounded-pill">
                                        Xem chi tiết
                                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="ms-1">
                                          <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                        </svg>
                                      </Button>
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                        </>
                      )}
                    </Card.Body>
                  </Card>
                )}
              </>
            )}

            <OrderDetail show={showDetail} onHide={() => setShowDetail(false)} orderId={selectedId} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TrackOrderPage;
