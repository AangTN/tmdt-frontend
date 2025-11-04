import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true
};

function authReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false
      };
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'INIT', payload: user });
      } catch (e) {
        dispatch({ type: 'INIT', payload: null });
      }
    } else {
      dispatch({ type: 'INIT', payload: null });
    }
  }, []);

  const login = (userData) => {
    // Backwards-compatible local login helper (keeps existing callers working)
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch({ type: 'LOGIN', payload: userData });
  };

  // Real login that talks to backend
  const loginWithApi = async ({ email, matKhau }) => {
    try {
      const res = await api.post('/api/auth/login', { email, matKhau });
      const data = res.data;
      if (res.status === 200 && data && data.user) {
        // Persist user and credentials (note: storing password locally is sensitive; ensure secure context)
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('auth:credentials', JSON.stringify({ email, matKhau }));
        dispatch({ type: 'LOGIN', payload: data.user });
        return { ok: true, user: data.user, message: data.message };
      }
      return { ok: false, message: data?.message || 'Đăng nhập thất bại' };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Lỗi khi đăng nhập';
      return { ok: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  // Register via API. Payload should include at least { email, hoTen, matKhau } and optionally soDienThoai
  const register = async ({ email, hoTen, matKhau, soDienThoai }) => {
    try {
      const res = await api.post('/api/auth/register', { email, hoTen, matKhau, soDienThoai });
      const data = res.data;
      // If backend returns a user object on register, persist and set auth
      if (res.status === 200 && data && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({ type: 'LOGIN', payload: data.user });
        return { ok: true, user: data.user, message: data.message };
      }
      return { ok: false, message: data?.message || 'Đăng ký thất bại' };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Lỗi khi đăng ký';
      return { ok: false, message: msg };
    }
  };

  // Auto-login on mount using saved credentials if available
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (state.isAuthenticated) return; // already logged in from persisted user
        const raw = localStorage.getItem('auth:credentials');
        if (!raw) return;
        const creds = JSON.parse(raw);
        if (!creds?.email || !creds?.matKhau) return;
        const res = await api.post('/api/auth/login', { email: creds.email, matKhau: creds.matKhau });
        const data = res.data;
        if (!cancelled && res.status === 200 && data && data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          dispatch({ type: 'LOGIN', payload: data.user });
        }
      } catch (e) {
        // Optional: clear bad credentials
        // localStorage.removeItem('auth:credentials');
      }
    })();
    return () => { cancelled = true; };
    // re-run only if auth state changes from logged-out
  }, [state.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ 
      user: state.user, 
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      // primary login function: talks to backend
      login: loginWithApi,
      // convenience local login helper (if some callers still pass a user object)
      loginLocal: login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
