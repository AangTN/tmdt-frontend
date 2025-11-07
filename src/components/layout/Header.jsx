import React from 'react';
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Cart3, PersonCircle } from 'react-bootstrap-icons';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const { totalQuantity } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.sticky}>
      <Navbar expand="lg" className={styles.navBar}>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className={`text-danger ${styles.brand}`}>
              <img src="/logo.svg" alt="logo" /> 
              <span className="gradient-text">Secret Pizza</span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto ms-lg-4">
              <LinkContainer to="/">
                <Nav.Link className={styles.navLink}>Trang chủ</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/menu">
                <Nav.Link className={styles.navLink}>Menu</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/about">
                <Nav.Link className={styles.navLink}>Giới thiệu</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/track-order">
                <Nav.Link className={styles.navLink}>Theo dõi đơn</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav className="d-flex align-items-center gap-3">
              {isAuthenticated ? (
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="link" 
                    className={`text-decoration-none d-flex align-items-center ${styles.navLink}`}
                    style={{ color: 'inherit' }}
                  >
                    <PersonCircle size={24} className="me-2" />
                    <span>{user?.hoTen || user?.email}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <LinkContainer to="/profile/edit">
                      <Dropdown.Item>
                        Chỉnh sửa thông tin
                      </Dropdown.Item>
                    </LinkContainer>
                    <Dropdown.Item onClick={handleLogout}>
                      Đăng xuất
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className={`d-flex align-items-center ${styles.navLink}`}>
                    <PersonCircle size={24} className="me-2" />
                    <span>Đăng nhập</span>
                  </Nav.Link>
                </LinkContainer>
              )}
              
              <LinkContainer to="/cart">
                <Nav.Link className={`d-flex align-items-center ${styles.cartBadge}`}>
                  <Cart3 size={22} className="me-2" />
                  <span className="fw-semibold">Giỏ hàng</span>
                  {totalQuantity > 0 && (
                    <Badge bg="danger" pill className="ms-2">{totalQuantity}</Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
