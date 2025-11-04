import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getShippingQuote } from '../services/shippingService';
import { api } from '../services/api';
import { getProvinces, getDistricts, getWards } from '../services/locationService';

const CheckoutPage = () => {
  const { items, subtotal, clear } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hoTen: '',
    soDienThoai: '',
    diaChi: '',
    soNhaDuong: '',
    phuongXa: '',
    quanHuyen: '',
    thanhPho: '',
    ghiChu: '',
    phuongThucThanhToan: 'cod' // default to COD
  });

  const [shipping, setShipping] = useState({ loading: false, data: null, error: null });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [locLoading, setLocLoading] = useState({ p: false, d: false, w: false });
  
  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [voucher, setVoucher] = useState(null);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

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

  // Load provinces at mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLocLoading((s) => ({ ...s, p: true }));
        const list = await getProvinces();
        if (!cancelled) setProvinces(list);
      } finally {
        if (!cancelled) setLocLoading((s) => ({ ...s, p: false }));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleProvinceSelect = async (e) => {
    const code = e.target.value;
    const selected = provinces.find((p) => String(p.code) === String(code));
    setFormData((prev) => ({ ...prev, thanhPho: selected?.name || '', quanHuyen: '', phuongXa: '' }));
    setDistricts([]); setWards([]);
    if (!code) return;
    setLocLoading((s) => ({ ...s, d: true }));
    try {
      const ds = await getDistricts(code);
      setDistricts(ds);
    } finally {
      setLocLoading((s) => ({ ...s, d: false }));
    }
  };

  const handleDistrictSelect = async (e) => {
    const code = e.target.value;
    const selected = districts.find((d) => String(d.code) === String(code));
    setFormData((prev) => ({ ...prev, quanHuyen: selected?.name || '', phuongXa: '' }));
    setWards([]);
    if (!code) return;
    setLocLoading((s) => ({ ...s, w: true }));
    try {
      const ws = await getWards(code);
      setWards(ws);
    } finally {
      setLocLoading((s) => ({ ...s, w: false }));
    }
  };

  const handleWardSelect = (e) => {
    const code = e.target.value;
    const selected = wards.find((w) => String(w.code) === String(code));
    setFormData((prev) => ({ ...prev, phuongXa: selected?.name || '' }));
  };

  // Apply voucher
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherError('Vui lòng nhập mã voucher');
      return;
    }

    setVoucherLoading(true);
    setVoucherError('');
    setVoucherSuccess('');
    
    try {
      const response = await fetch(`http://localhost:3001/api/vouchers/${voucherCode.trim()}`);
      const result = await response.json();

      if (!response.ok || !result.data) {
        throw new Error(result.message || 'Voucher không tồn tại');
      }

      const voucherData = result.data;

      // Kiểm tra trạng thái
      if (voucherData.TrangThai !== 'Active') {
        throw new Error('Voucher không còn hiệu lực');
      }

      // Kiểm tra thời gian
      const now = new Date();
      const startDate = new Date(voucherData.NgayBatDau);
      const endDate = new Date(voucherData.NgayKetThuc);
      
      if (now < startDate) {
        throw new Error('Voucher chưa đến thời gian áp dụng');
      }
      if (now > endDate) {
        throw new Error('Voucher đã hết hạn');
      }

      // Kiểm tra số lượng
      if (voucherData.usedCount >= voucherData.SoLuong) {
        throw new Error('Voucher đã hết lượt sử dụng');
      }

      // Kiểm tra điều kiện đơn hàng
      const minOrder = Number(voucherData.DieuKienApDung || 0);
      if (subtotal < minOrder) {
        throw new Error(`Đơn hàng tối thiểu ${minOrder.toLocaleString()} đ để áp dụng voucher này`);
      }

      // Áp dụng voucher thành công
      setVoucher(voucherData);
      setVoucherSuccess(`Áp dụng voucher thành công! ${voucherData.MoTa}`);
    } catch (error) {
      setVoucherError(error.message);
      setVoucher(null);
    } finally {
      setVoucherLoading(false);
    }
  };

  // Remove voucher
  const handleRemoveVoucher = () => {
    setVoucher(null);
    setVoucherCode('');
    setVoucherError('');
    setVoucherSuccess('');
  };

  // Debounce shipping quote when all fields are available
  useEffect(() => {
  const { soNhaDuong, phuongXa, quanHuyen, thanhPho } = formData;
  const ready = soNhaDuong && phuongXa && quanHuyen && thanhPho;
    if (!ready) {
      setShipping((prev) => ({ ...prev, data: null, error: null }));
      return;
    }
    setShipping((prev) => ({ ...prev, loading: true, error: null }));
    const t = setTimeout(async () => {
      try {
        const quote = await getShippingQuote({ soNhaDuong, phuongXa, quanHuyen, thanhPho });
        setShipping({ loading: false, data: quote, error: null });
      } catch (err) {
        setShipping({ loading: false, data: null, error: err.message || 'Không tính được phí giao hàng' });
      }
    }, 500);
    return () => clearTimeout(t);
  }, [formData.soNhaDuong, formData.phuongXa, formData.quanHuyen, formData.thanhPho]);

  // Calculate discount
  const discount = useMemo(() => {
    if (!voucher) return 0;
    
    if (voucher.LoaiGiamGia === 'PERCENT') {
      const percentValue = Number(voucher.GiaTri || 0);
      return Math.floor((subtotal * percentValue) / 100);
    } else if (voucher.LoaiGiamGia === 'AMOUNT') {
      return Number(voucher.GiaTri || 0);
    }
    return 0;
  }, [voucher, subtotal]);

  const shippingFee = useMemo(() => (shipping?.data?.canShip ? Number(shipping.data.fee || 0) : 0), [shipping]);
  const total = useMemo(() => {
    const afterDiscount = Math.max(0, Number(subtotal) - discount);
    return afterDiscount + shippingFee;
  }, [subtotal, shippingFee, discount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      // Send Vietnamese labels for payment method to backend as requested
      const paymentMethod = formData.phuongThucThanhToan === 'bank' ? 'Chuyển Khoản' : 'Tiền Mặt';
      const isBankTransfer = formData.phuongThucThanhToan === 'bank';
      const payload = {
        maNguoiDung: isAuthenticated && user?.maNguoiDung ? user.maNguoiDung : null,
        soNhaDuong: formData.soNhaDuong || '',
        phuongXa: formData.phuongXa || '',
        quanHuyen: formData.quanHuyen || '',
        thanhPho: formData.thanhPho || '',
        tenNguoiNhan: formData.hoTen || '',
        soDienThoaiGiaoHang: formData.soDienThoai || '',
        maVoucher: voucher?.code || null,
        tienTruocGiamGia: Number(subtotal) || 0,
        tienGiamGia: Number(discount) || 0,
        phiShip: Number(shippingFee) || 0,
        tongTien: Number(total) || 0,
        ghiChu: formData.ghiChu || '',
        items: items.map(it => ({
          maBienThe: it.bienTheId ?? null,
          maDeBanh: it.deBanhId ?? null,
          soLuong: Number(it.soLuong || 0),
          tuyChon: Array.isArray(it.tuyChonThem) ? it.tuyChonThem.map(id => ({ maTuyChon: Number(id) })) : []
        })),
        payment: { phuongThuc: paymentMethod }
      };

      const res = await api.post('/api/orders', payload);
      const data = res.data;
      const ok = res.status >= 200 && res.status < 300;
      const payloadData = (data && typeof data === 'object' && data.data && typeof data.data === 'object') ? data.data : data;
      if (ok && payloadData) {
        const paymentUrl = payloadData.paymentUrl || payloadData.payment?.url;
        if (paymentUrl) {
          clear();
          window.location.assign(paymentUrl);
          return;
        }
        setSubmitSuccess(payloadData.message || data.message || 'Tạo đơn hàng thành công');
        clear();
        try {
          navigate('/order-success', { state: { order: payloadData } });
        } catch (_) {
          window.location.assign('/order-success');
        }
        return;
      }
      setSubmitError(data?.message || 'Tạo đơn hàng thất bại');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Tạo đơn hàng thất bại';
      setSubmitError(msg);
      if (typeof msg === 'string' && msg.includes('Dữ liệu giỏ hàng đã thay đổi')) {
        clear();
      }
    } finally {
      setSubmitLoading(false);
    }
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
                  <Col md={12} className="pt-2">
                    <Row className="g-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Số nhà, đường</Form.Label>
                          <Form.Control
                            name="soNhaDuong"
                            value={formData.soNhaDuong}
                            onChange={handleChange}
                            placeholder="259/18 Hàn Hải Nguyên"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Thành phố</Form.Label>
                          <Form.Select aria-label="Chọn tỉnh/thành" onChange={handleProvinceSelect} defaultValue="">
                            <option value="" disabled>Chọn tỉnh/thành</option>
                            {provinces.map((p) => (
                              <option key={p.code} value={p.code}>{p.name}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Quận/Huyện</Form.Label>
                          <Form.Select aria-label="Chọn quận/huyện" onChange={handleDistrictSelect} value={districts.find((d) => d.name === formData.quanHuyen)?.code || ''} disabled={!formData.thanhPho || locLoading.d}>
                            <option value="" disabled>{locLoading.d ? 'Đang tải...' : 'Chọn quận/huyện'}</option>
                            {districts.map((d) => (
                              <option key={d.code} value={d.code}>{d.name}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Phường/Xã</Form.Label>
                          <Form.Select aria-label="Chọn phường/xã" onChange={handleWardSelect} value={wards.find((w) => w.name === formData.phuongXa)?.code || ''} disabled={!formData.quanHuyen || locLoading.w}>
                            <option value="" disabled>{locLoading.w ? 'Đang tải...' : 'Chọn phường/xã'}</option>
                            {wards.map((w) => (
                              <option key={w.code} value={w.code}>{w.name}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="small text-muted mt-2">
                      Hệ thống sẽ tự động ước tính phí giao hàng khi bạn nhập số nhà, đường và chọn đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã.
                    </div>
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
                                <div className="fw-semibold">Tiền Mặt</div>
                                <small className="text-muted">Thanh toán khi nhận hàng</small>
                              </div>
                            </div>
                          }
                          checked={formData.phuongThucThanhToan === 'cod'}
                          onChange={handleChange}
                          className="mb-2"
                        />
                        <Form.Check
                          type="radio"
                          id="payment-bank"
                          name="phuongThucThanhToan"
                          value="bank"
                          label={
                            <div className="d-flex align-items-center">
                              <span className="me-2">🏦</span>
                              <div>
                                <div className="fw-semibold">Chuyển Khoản</div>
                                <small className="text-muted">Chuyển Khoản ngân hàng</small>
                              </div>
                            </div>
                          }
                          checked={formData.phuongThucThanhToan === 'bank'}
                          onChange={handleChange}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-3 d-flex justify-content-end">
                  <Button type="submit" variant="danger" disabled={submitLoading}>
                    {submitLoading ? 'Đang tạo đơn…' : 'Đặt hàng'}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
          <Col md={5}>
            <Card className="p-3">
              <h5>Tóm tắt đơn hàng</h5>
              {submitError && (
                <Alert variant="danger" className="py-2 px-3 small mt-2">{submitError}</Alert>
              )}
              {submitSuccess && (
                <Alert variant="success" className="py-2 px-3 small mt-2">{submitSuccess}</Alert>
              )}
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

              {/* Voucher section */}
              <div className="mt-3 border-top pt-3">
                <Form.Label className="fw-semibold">Mã giảm giá</Form.Label>
                <div className="d-flex gap-2 mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Nhập mã voucher"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    disabled={!!voucher || voucherLoading}
                  />
                  {voucher ? (
                    <Button 
                      variant="outline-danger" 
                      onClick={handleRemoveVoucher}
                    >
                      Hủy
                    </Button>
                  ) : (
                    <Button 
                      variant="outline-primary" 
                      onClick={handleApplyVoucher}
                      disabled={voucherLoading}
                    >
                      {voucherLoading ? 'Đang kiểm tra...' : 'Áp dụng'}
                    </Button>
                  )}
                </div>
                {voucherError && (
                  <Alert variant="danger" className="py-2 px-3 small mb-0">
                    {voucherError}
                  </Alert>
                )}
                {voucherSuccess && (
                  <Alert variant="success" className="py-2 px-3 small mb-0">
                    ✓ {voucherSuccess}
                  </Alert>
                )}
              </div>

              {/* Shipping quote info */}
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span>Phí giao hàng</span>
                  {shipping.loading ? (
                    <span className="text-muted">Đang tính…</span>
                  ) : shipping.error ? (
                    <span className="text-danger">{shipping.error}</span>
                  ) : shipping.data ? (
                    shipping.data.canShip ? (
                      <strong>{Number(shipping.data.fee).toLocaleString()} đ</strong>
                    ) : (
                      <span className="text-danger">Không hỗ trợ giao ({shipping.data.message || 'ngoài phạm vi'})</span>
                    )
                  ) : (
                    <span className="text-muted">Nhập địa chỉ để tính phí</span>
                  )}
                </div>
                {shipping?.data?.canShip && (
                  <div className="small text-muted">
                    Khoảng cách ~ {Number(shipping.data.distanceKm).toFixed(2)} km • Dự kiến {shipping.data.etaMinutes} phút
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span>Tạm tính</span>
                <strong>{subtotal.toLocaleString()} đ</strong>
              </div>
              
              {discount > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-2 text-success">
                  <span>Giảm giá ({voucher?.code})</span>
                  <strong>-{discount.toLocaleString()} đ</strong>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mt-2 border-top pt-2">
                <span className="fw-bold">Tổng thanh toán</span>
                <strong className="text-danger fs-5">{total.toLocaleString()} đ</strong>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CheckoutPage;
