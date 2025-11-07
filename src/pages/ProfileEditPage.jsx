import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { getProvinces, getDistricts, getWards } from '../services/locationService';
import { useAuth } from '../contexts/AuthContext';

const initialState = {
  hoTen: '',
  soDienThoai: '',
  soNhaDuong: '',
  phuongXa: '',
  quanHuyen: '',
  thanhPho: ''
};

const ProfileEditPage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(initialState);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState({ p: false, d: false, w: false });
  const ALLOWED_CITY_REGEX = useMemo(() => ({
    HN: /Hà\s*Nội|Ha\s*Noi/i,
    HCM: /Hồ\s*Chí\s*Minh|Ho\s*Chi\s*Minh|HCM/i
  }), []);
  const isAllowedCityName = (name = '') => ALLOWED_CITY_REGEX.HN.test(name) || ALLOWED_CITY_REGEX.HCM.test(name);

  useEffect(() => {
    // Prefill from user context if available
    if (user) {
      setForm(f => ({
        ...f,
        hoTen: user.hoTen || '',
        soDienThoai: user.soDienThoai || ''
      }));
    }
  }, [user]);

  // Load provinces
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(s => ({ ...s, p: true }));
      try {
        const list = await getProvinces();
        const filtered = Array.isArray(list) ? list.filter(p => isAllowedCityName(p.name)) : [];
        if (!cancelled) setProvinces(filtered);
      } finally {
        if (!cancelled) setLoading(s => ({ ...s, p: false }));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProvince = async (e) => {
    const code = e.target.value;
    const province = provinces.find(p => p.code === code);
    setForm(prev => ({ ...prev, thanhPho: province?.name || '', quanHuyen: '', phuongXa: '' }));
    setDistricts([]); setWards([]);
    if (!code) return;
    if (!isAllowedCityName(province?.name || '')) {
      return;
    }
    setLoading(s => ({ ...s, d: true }));
    try {
      const ds = await getDistricts(code);
      setDistricts(ds);
    } finally {
      setLoading(s => ({ ...s, d: false }));
    }
  };

  const handleDistrict = async (e) => {
    const code = e.target.value;
    const district = districts.find(d => d.code === code);
    setForm(prev => ({ ...prev, quanHuyen: district?.name || '', phuongXa: '' }));
    setWards([]);
    if (!code) return;
    setLoading(s => ({ ...s, w: true }));
    try {
      const ws = await getWards(code);
      setWards(ws);
    } finally {
      setLoading(s => ({ ...s, w: false }));
    }
  };

  const handleWard = (e) => {
    const code = e.target.value;
    const ward = wards.find(w => w.code === code);
    setForm(prev => ({ ...prev, phuongXa: ward?.name || '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just log the payload until API exists
    const payload = {
      HoTen: form.hoTen.trim(),
      SoDienThoai: form.soDienThoai.trim() || null,
      SoNhaDuong: form.soNhaDuong.trim() || null,
      PhuongXa: form.phuongXa || null,
      QuanHuyen: form.quanHuyen || null,
      ThanhPho: form.thanhPho || null
    };
    console.log('PROFILE_UPDATE_PAYLOAD', payload);
    alert('Đã chuẩn bị dữ liệu (xem console). Chưa có API để lưu.');
  };

  return (
    <section className="py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <h1 className="mb-4" style={{ fontWeight: 800 }}>Chỉnh sửa thông tin cá nhân</h1>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="hoTen">
                    <Form.Label>Họ và Tên *</Form.Label>
                    <Form.Control
                      name="hoTen"
                      required
                      value={form.hoTen}
                      onChange={onChange}
                      placeholder="Nhập họ tên"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="soDienThoai">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      name="soDienThoai"
                      value={form.soDienThoai}
                      onChange={onChange}
                      placeholder="Ví dụ: 0901234567"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="soNhaDuong">
                    <Form.Label>Số nhà / Đường</Form.Label>
                    <Form.Control
                      name="soNhaDuong"
                      value={form.soNhaDuong}
                      onChange={onChange}
                      placeholder="VD: 123 Nguyễn Trãi"
                    />
                  </Form.Group>
                  <Row>
                    <Col md={4} className="mb-3">
                      <Form.Label>Thành phố / Tỉnh (chỉ TP.HCM, Hà Nội)</Form.Label>
                      <Form.Select onChange={handleProvince} value={provinces.find(p=>p.name===form.thanhPho)?.code || ''}>
                        <option value="">-- Chọn tỉnh --</option>
                        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                      </Form.Select>
                      {loading.p && <small className="text-muted">Đang tải tỉnh...</small>}
                    </Col>
                    <Col md={4} className="mb-3">
                      <Form.Label>Quận / Huyện</Form.Label>
                      <Form.Select onChange={handleDistrict} value={districts.find(d=>d.name===form.quanHuyen)?.code || ''} disabled={!form.thanhPho}>
                        <option value="">-- Chọn huyện --</option>
                        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                      </Form.Select>
                      {loading.d && <small className="text-muted">Đang tải huyện...</small>}
                    </Col>
                    <Col md={4} className="mb-3">
                      <Form.Label>Phường / Xã</Form.Label>
                      <Form.Select onChange={handleWard} value={wards.find(w=>w.name===form.phuongXa)?.code || ''} disabled={!form.quanHuyen}>
                        <option value="">-- Chọn phường --</option>
                        {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                      </Form.Select>
                      {loading.w && <small className="text-muted">Đang tải phường...</small>}
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end mt-3">
                    <Button type="submit" variant="danger" size="lg">Lưu thay đổi</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProfileEditPage;
