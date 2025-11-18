import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for free tier DB
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry helper for slow free-tier connections
async function retryRequest(fn, retries = 2, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || error.response?.status >= 500)) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 1.5);
    }
    throw error;
  }
}

export function assetUrl(path) {
  const base = API_BASE_URL.replace(/\/$/, '');
  const p = String(path || '').replace(/^\//, '');
  return `${base}/${p}`;
}

export async function fetchFoods() {
  return retryRequest(async () => {
    // Public endpoint returning available foods for storefront
    const res = await api.get('/api/foods');
    return res.data;
  });
}

// Admin-specific fetch: returns all foods including hidden/inactive for admin UI
export async function fetchFoodsAdmin() {
  return retryRequest(async () => {
    const res = await api.get('/api/foods/admin/all');
    return res.data;
  });
}

export async function fetchBestSellingFoods() {
  return retryRequest(async () => {
    const res = await api.get('/api/foods/best-selling/top');
    return res.data;
  });
}

export async function fetchFeaturedFoods() {
  return retryRequest(async () => {
    const res = await api.get('/api/foods/featured/all');
    return res.data;
  });
}

export async function fetchTypes() {
  return retryRequest(async () => {
    const res = await api.get('/api/types');
    return res.data;
  });
}

export async function fetchCategories() {
  return retryRequest(async () => {
    const res = await api.get('/api/categories');
    return res.data;
  });
}

export async function fetchVariants() {
  return retryRequest(async () => {
    const res = await api.get('/api/variants');
    return res.data;
  });
}

export async function fetchOptionPrices() {
  return retryRequest(async () => {
    const res = await api.get('/api/variants/option-prices');
    return res.data;
  });
}

export async function fetchCrusts() {
  return retryRequest(async () => {
    const res = await api.get('/api/crusts');
    return res.data;
  });
}

export async function fetchSizes() {
  return retryRequest(async () => {
    const res = await api.get('/api/sizes');
    return res.data;
  });
}

export async function fetchOptions() {
  return retryRequest(async () => {
    const res = await api.get('/api/options');
    // API trả về mảng các loại tùy chọn, mỗi loại có mảng TuyChon
    // Flatten để lấy tất cả options
    const data = res.data;
    if (Array.isArray(data)) {
      const allOptions = [];
      data.forEach(type => {
        if (Array.isArray(type.TuyChon)) {
          allOptions.push(...type.TuyChon);
        }
      });
      return allOptions;
    }
    return [];
  });
}

export async function fetchBanners() {
  return retryRequest(async () => {
    const res = await api.get('/api/banners');
    return res.data;
  });
}

export async function fetchBranches() {
  return retryRequest(async () => {
    const res = await api.get('/api/branches');
    return res.data;
  });
}

// Uploads
export async function uploadImage(file) {
  // Accepts a File or Blob; posts multipart/form-data to /api/uploads
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/api/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

// Combos
export async function fetchCombos() {
  return retryRequest(async () => {
    const res = await api.get('/api/combos');
    return res.data;
  });
}

export async function fetchCombosAdmin() {
  return retryRequest(async () => {
    const res = await api.get('/api/combos/admin');
    return res.data;
  });
}

export async function fetchOrders() {
  return retryRequest(async () => {
    const res = await api.get('/api/orders');
    return res.data;
  });
}

export async function fetchReviews() {
  return retryRequest(async () => {
    const res = await api.get('/api/reviews');
    return res.data;
  });
}

export async function fetchOrderReviews() {
  return retryRequest(async () => {
    const res = await api.get('/api/orders/reviews');
    return res.data;
  });
}

export async function fetchAllAccounts() {
  return retryRequest(async () => {
    const res = await api.get('/api/users/admin/all-accounts');
    return res.data;
  });
}

export async function fetchComboById(id) {
  return retryRequest(async () => {
    const res = await api.get(`/api/combos/${id}`);
    return res.data;
  });
}

// Vouchers
export async function fetchVoucherByCode(code) {
  return retryRequest(async () => {
    const res = await api.get(`/api/vouchers/${code}`);
    return res.data;
  });
}
