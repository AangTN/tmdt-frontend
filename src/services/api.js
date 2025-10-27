import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export function assetUrl(path) {
  const base = API_BASE_URL.replace(/\/$/, '');
  const p = String(path || '').replace(/^\//, '');
  return `${base}/${p}`;
}

export async function fetchFoods() {
  const res = await api.get('/api/foods');
  return res.data;
}

export async function fetchTypes() {
  const res = await api.get('/api/types');
  return res.data;
}

export async function fetchCategories() {
  const res = await api.get('/api/categories');
  return res.data;
}

export async function fetchVariants() {
  const res = await api.get('/api/variants');
  return res.data;
}

export async function fetchOptionPrices() {
  const res = await api.get('/api/variants/option-prices');
  return res.data;
}

export async function fetchCrusts() {
  const res = await api.get('/api/crusts');
  return res.data;
}
