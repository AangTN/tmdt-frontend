import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const AdminAuthContext = createContext();

const SESSION_KEY = 'adminSession';
const CREDENTIAL_KEY = 'adminCredentials';

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [credentials, setCredentials] = useState(null);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) {
        setAdmin(JSON.parse(savedSession));
      }
    } catch (error) {
      console.warn('Failed to restore admin session', error);
    }
    try {
      const savedCredentials = localStorage.getItem(CREDENTIAL_KEY);
      if (savedCredentials) {
        setCredentials(JSON.parse(savedCredentials));
      }
    } catch (error) {
      console.warn('Failed to restore admin credentials', error);
    }
  }, []);

  const persistSession = (session) => {
    setAdmin(session);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to persist admin session', error);
    }
  };

  const login = useCallback(({ username, password }) => {
    if (!username || !password) {
      return { success: false, message: 'Vui lòng nhập đầy đủ thông tin.' };
    }

    // Nếu chưa có tài khoản quản trị, đăng nhập lần đầu sẽ tạo mới
    if (!credentials) {
      const newCredentials = {
        username,
        password,
        createdAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(CREDENTIAL_KEY, JSON.stringify(newCredentials));
        setCredentials(newCredentials);
      } catch (error) {
        console.error('Failed to save admin credentials', error);
        return { success: false, message: 'Không thể lưu tài khoản quản trị.' };
      }
      persistSession({ username, loggedAt: new Date().toISOString() });
      return { success: true, firstTime: true };
    }

    if (credentials.username !== username || credentials.password !== password) {
      return { success: false, message: 'Sai tài khoản hoặc mật khẩu quản trị.' };
    }

    persistSession({ username, loggedAt: new Date().toISOString() });
    return { success: true };
  }, [credentials]);

  const logout = useCallback(() => {
    setAdmin(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Failed to remove admin session', error);
    }
  }, []);

  const value = useMemo(() => ({
    admin,
    adminCredentials: credentials,
    isAuthenticated: Boolean(admin),
    login,
    logout,
  }), [admin, credentials, login, logout]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
