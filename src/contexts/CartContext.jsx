import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  // items: [{
  //   key,               // derived identity: monAnId|bienTheId|deBanhId|[sorted tuyChonThem]
  //   monAnId,           // number
  //   bienTheId,         // number|null
  //   soLuong,           // number
  //   deBanhId,          // number|null
  //   tuyChonThem,       // number[]
  //   unitPrice,         // number (base variant price + options extras for selected size)
  //   name, image        // display helpers
  // }]
  items: []
};

const STORAGE_KEY = 'cart';
const COMPACT_KEY = 'cart:compact';

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.items) && parsed.items.every(it => it?.monAnId != null)) {
        const items = parsed.items.map(it => ({ ...it, key: it.key || buildKey(it) }));
        return { items };
      }
    }
    const compact = localStorage.getItem(COMPACT_KEY);
    if (compact) {
      const rawItems = JSON.parse(compact);
      if (Array.isArray(rawItems)) {
        const items = rawItems
          .filter(it => it && it.monAnId != null)
          .map(it => normalizeItem({
            monAnId: it.monAnId,
            bienTheId: it.bienTheId ?? null,
            soLuong: it.soLuong ?? 1,
            deBanhId: it.deBanhId ?? null,
            tuyChonThem: Array.isArray(it.tuyChonThem) ? it.tuyChonThem : [],
          }));
        if (items.length > 0) return { items };
      }
    }
  } catch {}
  return initialState;
}

function buildKey(item) {
  const opts = Array.isArray(item.tuyChonThem) ? [...item.tuyChonThem].sort((a, b) => a - b) : [];
  const deBanh = item.deBanhId == null ? 'null' : String(item.deBanhId);
  const bienThe = item.bienTheId == null ? 'null' : String(item.bienTheId);
  return `${item.monAnId}|${bienThe}|${deBanh}|[${opts.join(',')}]`;
}

function normalizeItem(payload) {
  const base = {
    monAnId: payload.monAnId,
    bienTheId: payload.bienTheId ?? null,
    soLuong: Math.max(1, Number(payload.soLuong || 1)),
    deBanhId: payload.deBanhId ?? null,
    tuyChonThem: Array.isArray(payload.tuyChonThem) ? payload.tuyChonThem.map(Number) : [],
    unitPrice: Number(payload.unitPrice || 0),
    name: payload.name || '',
    image: payload.image || ''
  };
  return { ...base, key: buildKey(base) };
}

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload || initialState;
    case 'ADD': {
      const newItem = normalizeItem(action.payload);
      const existing = state.items.find(i => i.key === newItem.key);
      const items = existing
        ? state.items.map(i => i.key === newItem.key ? { ...i, soLuong: i.soLuong + newItem.soLuong } : i)
        : [...state.items, newItem];
      return { ...state, items };
    }
    case 'REMOVE': {
      const items = state.items.filter(i => i.key !== action.payload.key);
      return { ...state, items };
    }
    case 'SET_QTY': {
      const { key, soLuong } = action.payload;
      const items = state.items.map(i => i.key === key ? { ...i, soLuong: Math.max(1, Number(soLuong)) } : i);
      return { ...state, items };
    }
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  // Load synchronously from localStorage to avoid losing cart on refresh/flicker
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      const compactItems = state.items.map(({ monAnId, bienTheId, soLuong, deBanhId, tuyChonThem }) => ({
        monAnId,
        bienTheId,
        soLuong,
        deBanhId,
        tuyChonThem,
      }));
      localStorage.setItem(COMPACT_KEY, JSON.stringify(compactItems));
    } catch {}
  }, [state]);

  const totalQuantity = useMemo(() => state.items.reduce((sum, i) => sum + Number(i.soLuong || 0), 0), [state.items]);
  const subtotal = useMemo(() => state.items.reduce((sum, i) => sum + Number(i.soLuong || 0) * Number(i.unitPrice || 0), 0), [state.items]);

  const value = useMemo(() => ({
    items: state.items,
    totalQuantity,
    subtotal,
    add: (item) => dispatch({ type: 'ADD', payload: item }),
    remove: (key) => dispatch({ type: 'REMOVE', payload: { key } }),
    setQty: (key, soLuong) => dispatch({ type: 'SET_QTY', payload: { key, soLuong } }),
    clear: () => dispatch({ type: 'CLEAR' })
  }), [state.items, totalQuantity, subtotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
