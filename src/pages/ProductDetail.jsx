import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { api, assetUrl } from '../services/api';
import { useCart } from '../contexts/CartContext';
import styles from './ProductDetail.module.css';

function variantPrice(variant) {
  const v = variant?.GiaBan;
  return v ? Number(v) : 0;
}

function optionExtraForSize(option, sizeId) {
  const price = option?.TuyChon_Gia?.find(g => g.Size?.MaSize === sizeId)?.GiaThem;
  return price ? Number(price) : 0;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { add } = useCart();
  const [loading, setLoading] = useState(true);
  const [food, setFood] = useState(null);
  const [sizeId, setSizeId] = useState(null);
  const [crustId, setCrustId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({}); // key: MaTuyChon boolean
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get(`/api/foods/${id}`);
        if (mounted) {
          setFood(res.data);
          const sizes = res.data?.BienTheMonAn?.map(v => v.Size).filter(Boolean) || [];
          if (sizes.length) setSizeId(sizes[0].MaSize);
          const crustList = (res.data?.MonAn_DeBanh || []).map(mdb => mdb.DeBanh).filter(Boolean) || [];
          if (crustList.length) setCrustId(crustList[0].MaDeBanh);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const imageUrl = useMemo(() => {
    return food?.HinhAnh ? assetUrl(`images/AnhMonAn/${food.HinhAnh}`) : '/placeholder.svg';
  }, [food]);

  const variants = food?.BienTheMonAn || [];
  const sizes = variants.map(v => v.Size).filter(Boolean);
  const type = food?.LoaiMonAn; // single type of this product
  const categories = (food?.MonAn_DanhMuc || []).map(md => md.DanhMuc);
  const crusts = (food?.MonAn_DeBanh || []).map(mdb => mdb.DeBanh);

  const baseVariant = variants.find(v => v.Size?.MaSize === sizeId) || null;
  const basePrice = variantPrice(baseVariant);

  const groupedOptions = useMemo(() => {
    const list = (food?.MonAn_TuyChon || []).map(mt => mt.TuyChon);
    const groups = {};
    list.forEach(opt => {
      const key = opt?.LoaiTuyChon?.TenLoaiTuyChon || 'Khác';
      if (!groups[key]) groups[key] = [];
      groups[key].push(opt);
    });
    return groups;
  }, [food]);

  const optionsExtra = useMemo(() => {
    const ids = Object.keys(selectedOptions).filter(k => selectedOptions[k]);
    return ids.reduce((sum, idStr) => {
      const idNum = Number(idStr);
      const list = (food?.MonAn_TuyChon || []).map(mt => mt.TuyChon);
      const opt = list.find(o => o.MaTuyChon === idNum);
      return sum + optionExtraForSize(opt, sizeId);
    }, 0);
  }, [selectedOptions, food, sizeId]);

  const total = useMemo(() => {
    return (basePrice + optionsExtra) * qty;
  }, [basePrice, optionsExtra, qty]);

  const toggleOption = (id) => {
    setSelectedOptions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addToCart = () => {
    if (!food) return;
    const optIds = Object.keys(selectedOptions)
      .filter(k => selectedOptions[k])
      .map(k => Number(k));
    // build display details
    const sizeName = baseVariant?.Size?.TenSize || null;
    const crust = crusts.find(c => c.MaDeBanh === crustId);
    const crustName = crust ? crust.TenDeBanh : null;
    const allOpts = (food?.MonAn_TuyChon || []).map(mt => mt.TuyChon);
    const optionsDetail = optIds.map(idNum => {
      const o = allOpts.find(x => x.MaTuyChon === idNum);
      return o ? {
        id: idNum,
        name: o.TenTuyChon,
        extra: optionExtraForSize(o, sizeId)
      } : { id: idNum, name: `Tùy chọn #${idNum}`, extra: 0 };
    });
    const item = {
      monAnId: food.MaMonAn,
      bienTheId: baseVariant?.MaBienThe ?? null,
      soLuong: qty,
      deBanhId: crustId ?? null,
      tuyChonThem: optIds,
      unitPrice: basePrice + optionsExtra,
      name: food.TenMonAn,
      image: imageUrl,
      sizeName,
      crustName,
      optionsDetail,
    };
    add(item);
  };

  if (loading) {
    return (
      <section className={styles.loadingSpinner}>
        <Spinner animation="border" variant="danger" />
        <div className={styles.loadingText}>Đang tải thông tin món ăn...</div>
      </section>
    );
  }

  if (!food) {
    return (
      <section className="py-5 text-center">
        <h3>Không tìm thấy món ăn.</h3>
      </section>
    );
  }

  return (
    <section className={styles.detailContainer}>
      <Container className="py-5">
        <Row className="g-5">
          {/* Image Section */}
          <Col lg={5}>
            <div className={styles.imageSection}>
              <div className={`${styles.mainImage} ratio ratio-1x1`}>
                <img src={imageUrl} alt={food.TenMonAn} style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </Col>

          {/* Details Section */}
          <Col lg={7}>
            <h1 className={styles.productTitle}>{food.TenMonAn}</h1>
            
            <div className={styles.badgeGroup}>
              {type && <span className={styles.typeBadge}>{type.TenLoaiMonAn}</span>}
              {categories.map(c => (
                <span key={c.MaDanhMuc} className={styles.categoryBadge}>{c.TenDanhMuc}</span>
              ))}
            </div>

            {food.MoTa && (
              <p className="text-muted mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                {food.MoTa}
              </p>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mb-4">
                <h3 className={styles.sectionTitle}>Chọn kích thước</h3>
                <Row className="g-3">
                  {sizes.map(s => {
                    const variant = variants.find(v => v.Size?.MaSize === s.MaSize);
                    const price = variantPrice(variant);
                    return (
                      <Col xs={6} md={4} key={s.MaSize}>
                        <div
                          className={`${styles.optionCard} ${sizeId === s.MaSize ? styles.selected : ''}`}
                          onClick={() => setSizeId(s.MaSize)}
                        >
                          <div className={styles.optionLabel}>{s.TenSize}</div>
                          {price > 0 && (
                            <div className={styles.optionPrice}>{price.toLocaleString()} đ</div>
                          )}
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            )}

            {/* Crust Selection */}
            {crusts.length > 0 && (
              <div className="mb-4">
                <h3 className={styles.sectionTitle}>Chọn đế bánh</h3>
                <Row className="g-3">
                  {crusts.map(d => (
                    <Col xs={6} md={4} key={d.MaDeBanh}>
                      <div
                        className={`${styles.optionCard} ${crustId === d.MaDeBanh ? styles.selected : ''}`}
                        onClick={() => setCrustId(d.MaDeBanh)}
                      >
                        <div className={styles.optionLabel}>{d.TenDeBanh}</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Options */}
            {Object.keys(groupedOptions).length > 0 && (
              <div className="mb-4">
                <h3 className={styles.sectionTitle}>Tùy chọn thêm</h3>
                {Object.entries(groupedOptions).map(([group, opts]) => (
                  <div key={group} className={styles.optionsGroup}>
                    <div className={styles.optionsGroupTitle}>{group}</div>
                    <div className="d-flex flex-column gap-2">
                      {opts.map(o => {
                        const extra = optionExtraForSize(o, sizeId);
                        const isChecked = !!selectedOptions[o.MaTuyChon];
                        return (
                          <div
                            key={o.MaTuyChon}
                            className={`${styles.checkboxCard} ${isChecked ? styles.checked : ''}`}
                            onClick={() => toggleOption(o.MaTuyChon)}
                          >
                            <div className="d-flex align-items-center">
                              <div className={styles.checkIcon}>
                                {isChecked && '✓'}
                              </div>
                              <div className={styles.checkboxLabel}>{o.TenTuyChon}</div>
                            </div>
                            {extra > 0 && (
                              <div className={styles.checkboxPrice}>
                                +{extra.toLocaleString()} đ
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Price and Add to Cart */}
            <div className={styles.priceSection}>
              <div className={styles.priceLabel}>Tổng giá trị</div>
              <div className={styles.currentPrice}>
                {total.toLocaleString()} đ
              </div>

              <div className={styles.quantityControl}>
                <button className={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>
                  −
                </button>
                <div className={styles.qtyDisplay}>{qty}</div>
                <button className={styles.qtyBtn} onClick={() => setQty(qty + 1)}>
                  +
                </button>
              </div>

              <button className={styles.addToCartBtn} onClick={addToCart}>
                <span style={{ position: 'relative', zIndex: 1 }}>
                  🛒 Thêm vào giỏ hàng
                </span>
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductDetail;
