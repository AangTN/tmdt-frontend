import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  return (
    <section className="py-5 text-center">
      <Container>
        <div style={{ fontSize: 64 }}>🎉</div>
        <h2 className="mt-3">Đặt hàng thành công!</h2>
        <p className="text-muted">Cảm ơn bạn đã chọn Secret Pizza. Chúng tôi sẽ liên hệ và giao hàng sớm nhất.</p>
        <Link to="/menu">
          <Button variant="danger">Tiếp tục đặt món</Button>
        </Link>
      </Container>
    </section>
  );
};

export default OrderSuccessPage;
