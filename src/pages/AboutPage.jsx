import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <section className="py-4">
      <Container>
        <Row className="gy-4">
          <Col md={7}>
            <h2 className="mb-3">Về Secret Pizza</h2>
            <p>
              Secret Pizza ra đời từ đam mê mang đến những chiếc pizza tươi ngon, nóng hổi đến tay khách hàng thật nhanh.
              Chúng tôi chọn lọc nguyên liệu mỗi ngày, kết hợp công thức độc quyền để tạo nên hương vị khác biệt.
            </p>
            <p>
              Mục tiêu của chúng tôi là đơn giản hóa việc đặt món: vài cú chạm là có ngay bữa ăn chất lượng. Hãy khám phá menu và cảm nhận!
            </p>
          </Col>
          <Col md={5}>
            <Card className="p-3">
              <h5 className="mb-3">Cam kết</h5>
              <ul className="mb-0">
                <li>Nguyên liệu tươi 100%</li>
                <li>Giao hàng nhanh trong 30 phút</li>
                <li>Ưu đãi hấp dẫn hằng tuần</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutPage;
