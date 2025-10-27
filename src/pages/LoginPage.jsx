import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Tabs, Tab } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    hoTen: '',
    soDienThoai: '',
    diaChi: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Call API login endpoint
      // For now, mock login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success response (using email)
      const userData = {
        id: 1,
        email: formData.email,
        hoTen: 'Người dùng',
        soDienThoai: '0901234567',
        role: 'CUSTOMER'
      };

      login(userData);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Call API register endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success - auto login after register (using email)
      const userData = {
        id: Date.now(),
        email: formData.email,
        hoTen: formData.hoTen,
        soDienThoai: formData.soDienThoai,
        role: 'CUSTOMER'
      };

      login(userData);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5" style={{ background: 'linear-gradient(135deg, #fef3f2 0%, #fff 100%)', minHeight: '100vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <Card.Body className="p-4">
                <h2 className="text-center mb-4" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  🍕 SECRET PIZZA
                </h2>
                
                {error && <Alert variant="danger">{error}</Alert>}

                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-4"
                  justify
                >
                  <Tab eventKey="login" title="Đăng nhập">
                    <Form onSubmit={handleLogin}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Nhập email"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Nhập mật khẩu"
                          required
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        variant="danger"
                        className="w-100 mb-3"
                        disabled={loading}
                        style={{ 
                          padding: '0.75rem',
                          fontWeight: 700,
                          borderRadius: '10px'
                        }}
                      >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                      </Button>

                      <div className="text-center">
                        <Button
                          variant="link"
                          onClick={() => navigate(from, { replace: true })}
                          style={{ textDecoration: 'none' }}
                        >
                          Tiếp tục mua hàng không cần đăng nhập
                        </Button>
                      </div>
                    </Form>
                  </Tab>

                  <Tab eventKey="register" title="Đăng ký">
                    <Form onSubmit={handleRegister}>
                      <Form.Group className="mb-3">
                        <Form.Label>Họ tên</Form.Label>
                        <Form.Control
                          type="text"
                          name="hoTen"
                          value={formData.hoTen}
                          onChange={handleChange}
                          placeholder="Nhập họ tên"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                          type="tel"
                          name="soDienThoai"
                          value={formData.soDienThoai}
                          onChange={handleChange}
                          placeholder="Nhập số điện thoại"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Nhập email"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Nhập mật khẩu"
                          required
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        variant="danger"
                        className="w-100 mb-3"
                        disabled={loading}
                        style={{ 
                          padding: '0.75rem',
                          fontWeight: 700,
                          borderRadius: '10px'
                        }}
                      >
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                      </Button>

                      <div className="text-center">
                        <Button
                          variant="link"
                          onClick={() => navigate(from, { replace: true })}
                          style={{ textDecoration: 'none' }}
                        >
                          Tiếp tục mua hàng không cần đăng nhập
                        </Button>
                      </div>
                    </Form>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default LoginPage;
