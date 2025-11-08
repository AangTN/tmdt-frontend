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
    const res = await api.get('/api/foods');
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

// Combos
export async function fetchCombos() {
  return retryRequest(async () => {
    const res = await api.get('/api/combos');
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
