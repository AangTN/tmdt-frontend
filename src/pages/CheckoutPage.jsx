import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { items, subtotal, clear } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hoTen: '',
    soDienThoai: '',
    diaChi: '',
    ghiChu: '',
    phuongThucThanhToan: 'cod' // default to COD
  });

  useEffect(() => {
    // Auto-fill if user is logged in
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        hoTen: user.hoTen || '',
        soDienThoai: user.soDienThoai || ''
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call API to create order
    clear();
    navigate('/order-success');
  };

  return (
    <section className="py-4">
      <Container>
        <h2 className="mb-3">Thanh toán</h2>
        
        {!isAuthenticated && (
          <Alert variant="info" className="mb-4">
            💡 Bạn có thể <Alert.Link href="/login">đăng nhập</Alert.Link> để lưu thông tin và theo dõi đơn hàng dễ dàng hơn.
          </Alert>
        )}

        <Row>
          <Col md={7} className="mb-4">
            <Card className="p-3">
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Họ tên</Form.Label>
                      <Form.Control 
                        name="hoTen"
                        value={formData.hoTen}
                        onChange={handleChange}
                        required 
                        placeholder="Nguyễn Văn A" 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control 
                        name="soDienThoai"
                        value={formData.soDienThoai}
                        onChange={handleChange}
                        required 
                        placeholder="09xxxxxxxx" 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Địa chỉ</Form.Label>
                      <Form.Control 
                        name="diaChi"
                        value={formData.diaChi}
                        onChange={handleChange}
                        required 
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, thành phố" 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Ghi chú</Form.Label>
                      <Form.Control 
                        name="ghiChu"
                        value={formData.ghiChu}
                        onChange={handleChange}
                        as="textarea" 
                        rows={3} 
                        placeholder="Ví dụ: gọi trước khi giao" 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Phương thức thanh toán</Form.Label>
                      <div className="mt-2">
                        <Form.Check
                          type="radio"
                          id="payment-cod"
                          name="phuongThucThanhToan"
                          value="cod"
                          label={
                            <div className="d-flex align-items-center">
                              <span className="me-2">💵</span>
                              <div>
                                <div className="fw-semibold">Thanh toán khi nhận hàng (COD)</div>
                                <small className="text-muted">Thanh toán bằng tiền mặt khi nhận hàng</small>
                              </div>
                            </div>
                          }
                          checked={formData.phuongThucThanhToan === 'cod'}
                          onChange={handleChange}
                          className="mb-2"
                        />
                        <Form.Check
                          type="radio"
                          id="payment-momo"
                          name="phuongThucThanhToan"
                          value="momo"
                          label={
                            <div className="d-flex align-items-center">
                              <span className="me-2">📱</span>
                              <div>
                                <div className="fw-semibold">Ví MoMo</div>
                                <small className="text-muted">Thanh toán qua ví điện tử MoMo</small>
                              </div>
                            </div>
                          }
                          checked={formData.phuongThucThanhToan === 'momo'}
                          onChange={handleChange}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-3 d-flex justify-content-end">
                  <Button type="submit" variant="danger">Đặt hàng</Button>
                </div>
              </Form>
            </Card>
          </Col>
          <Col md={5}>
            <Card className="p-3">
              <h5>Tóm tắt đơn hàng</h5>
              <ul className="list-unstyled small mt-3 mb-0">
                {items.map(i => {
                  const segments = [];
                  if (i.sizeName) segments.push(`Size: ${i.sizeName}`);
                  if (i.crustName) segments.push(`Đế: ${i.crustName}`);
                  if (Array.isArray(i.optionsDetail) && i.optionsDetail.length > 0) {
                    const opts = i.optionsDetail
                      .map(o => `${o.name}${Number(o.extra) > 0 ? ` (+${Number(o.extra).toLocaleString()} đ)` : ''}`)
                      .join(', ');
                    segments.push(`Tùy chọn: ${opts}`);
                  }
                  const detailLine = segments.length > 0 ? ` (${segments.join('; ')})` : '';
                  return (
                    <li key={i.key} className="border-bottom py-2">
                      <div className="d-flex justify-content-between">
                        <span className="fw-semibold">{i.name}{detailLine} x {i.soLuong}</span>
                        <span>{(Number(i.soLuong) * Number(i.unitPrice)).toLocaleString()} đ</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span>Tạm tính</span>
                <strong className="text-danger">{subtotal.toLocaleString()} đ</strong>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CheckoutPage;
