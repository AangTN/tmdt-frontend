import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

const TrackOrderPage = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate with backend tracking endpoint when available
    setResult({ status: 'Đang chuẩn bị', code });
  };

  return (
    <section className="py-4">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="p-3">
              <h4 className="mb-3">Theo dõi đơn hàng</h4>
              <Form onSubmit={onSubmit} className="d-flex gap-2">
                <Form.Control placeholder="Nhập mã đơn hàng" value={code} onChange={(e) => setCode(e.target.value)} required />
                <Button variant="danger" type="submit">Tra cứu</Button>
              </Form>
              {result && (
                <Alert variant="light" className="mt-3 mb-0 border">
                  Mã đơn <strong>{result.code}</strong>: {result.status}
                </Alert>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TrackOrderPage;
