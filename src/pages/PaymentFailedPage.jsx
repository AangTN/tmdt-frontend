import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('orderId');
  const message = searchParams.get('message') || 'Giao dịch không thành công. Vui lòng thử lại.';

  return (
    <section className="py-5 bg-light min-vh-100">
      <Container>
        <Card className="border-0 shadow-sm text-center p-5" style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="mb-4">
            <svg width="120" height="120" fill="#dc3545" viewBox="0 0 16 16" className="mx-auto">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg>
          </div>
          
          <h2 className="text-danger fw-bold mb-3">Thanh toán thất bại</h2>
          
          <p className="text-muted mb-4 fs-5">
            {message}
          </p>

          {orderId && (
            <div className="alert alert-light border mb-4">
              <div className="small text-muted mb-1">Mã đơn hàng</div>
              <div className="fw-bold">#{orderId}</div>
            </div>
          )}

          <div className="mb-4">
            <p className="small text-muted mb-2">
              Đơn hàng của bạn vẫn được lưu. Bạn có thể:
            </p>
            <ul className="text-start small text-muted" style={{ maxWidth: 400, margin: '0 auto' }}>
              <li>Thử lại thanh toán với phương thức khác</li>
              <li>Kiểm tra lại thông tin thẻ/tài khoản</li>
              <li>Liên hệ ngân hàng nếu có vấn đề</li>
              <li>Chọn thanh toán khi nhận hàng (COD)</li>
            </ul>
          </div>

          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
            <Button 
              variant="danger" 
              size="lg" 
              className="px-4"
              onClick={() => navigate('/checkout')}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>
              Thử lại thanh toán
            </Button>
            
            <Button 
              variant="outline-secondary" 
              size="lg"
              className="px-4"
              onClick={() => navigate('/cart')}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              Quay lại giỏ hàng
            </Button>
          </div>

          <div className="mt-4 pt-4 border-top">
            <p className="small text-muted mb-2">Cần hỗ trợ?</p>
            <div className="d-flex gap-3 justify-content-center small">
              <a href="tel:1900xxxx" className="text-decoration-none">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="me-1">
                  <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                </svg>
                Hotline: 1900 xxxx
              </a>
              <span className="text-muted">|</span>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 text-decoration-none"
                onClick={() => navigate('/track-order')}
              >
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="me-1">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                </svg>
                Theo dõi đơn hàng
              </Button>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
};

export default PaymentFailedPage;
