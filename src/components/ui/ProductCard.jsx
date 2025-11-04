import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { assetUrl, fetchVariants, fetchOptionPrices } from '../../services/api';
import styles from './ProductCard.module.css';

// Simple in-memory caches to avoid N network calls across many cards
let __variantsCache = null;
let __optionPricesCache = null;
let __loadingPromise = null;

async function ensureVariantDataLoaded() {
  if (__variantsCache && __optionPricesCache) return { variants: __variantsCache, optionPrices: __optionPricesCache };
  if (!__loadingPromise) {
    __loadingPromise = Promise.all([fetchVariants(), fetchOptionPrices()])
      .then(([variants, optionPrices]) => {
        __variantsCache = Array.isArray(variants) ? variants : [];
        __optionPricesCache = Array.isArray(optionPrices) ? optionPrices : [];
        return { variants: __variantsCache, optionPrices: __optionPricesCache };
      })
      .finally(() => {
        // Keep the promise for dedupe, but allow re-use of caches
      });
  }
  return __loadingPromise;
}

const ProductCard = ({ pizza, onView }) => {
  const { add } = useCart();
  // Initial price from embedded variants if present (older payloads), else null until loaded
  const [price, setPrice] = useState(() => {
    if (pizza?.BienTheMonAn?.length) {
      const prices = pizza.BienTheMonAn.map(v => Number(v.GiaBan));
      return Math.min(...prices);
    }
    return null;
  });
  const image = pizza?.HinhAnh
    ? assetUrl(String(pizza.HinhAnh).startsWith('/') ? String(pizza.HinhAnh) : `/images/AnhMonAn/${pizza.HinhAnh}`)
    : '/placeholder.svg';

  // Reconcile price using new variants API to ensure consistency with cart logic
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { variants } = await ensureVariantDataLoaded();
        if (!mounted) return;
        const list = (variants || []).filter(v => v?.MonAn?.MaMonAn === pizza?.MaMonAn);
        if (list.length > 0) {
          const minPrice = Math.min(...list.map(v => Number(v.GiaBan)));
          setPrice(minPrice);
        } else if (price == null) {
          // No variants found; default to 0 so UI shows fallback text
          setPrice(0);
        }
      } catch (e) {
        if (mounted && price == null) setPrice(0);
      }
    })();
    return () => { mounted = false; };
    // we intentionally exclude `price` from deps to avoid overriding a later update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pizza?.MaMonAn]);

  return (
    <Link to={`/foods/${pizza.MaMonAn}`} className={styles.card} style={{ textDecoration: 'none' }}>
      <div className={`${styles.imageWrapper} ratio ratio-4x3`}>
        <img
          src={image}
          alt={pizza?.TenMonAn}
          loading="lazy"
          decoding="async"
          onError={(e) => { try { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.svg'; } catch {} }}
        />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.ratingStars}>
          ⭐⭐⭐⭐⭐ <span className="text-muted small">(4.8)</span>
        </div>
        <h5 className={styles.title}>{pizza?.TenMonAn}</h5>
        {typeof price === 'number' && price > 0 ? (
          <div className={styles.price}>Từ {price.toLocaleString()} đ</div>
        ) : (
          <div className="text-muted small">Xem chi tiết để biết giá</div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;