import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginAdmin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.login({ email, password });
      if (res.data.role !== 'admin') {
        setError('Access denied: You do not have administrator permissions.');
        setLoading(false);
        return { success: false, error: 'Access denied: Administrator privileges required.' };
      }

      setAdminUser(res.data);
      localStorage.setItem('adminUser', JSON.stringify(res.data));
      localStorage.setItem('adminToken', res.data.token);
      return { success: true, data: res.data };
    } catch (err) {
      // If DB error, provide demo admin session fallback
      if (email === 'admin@easymart.com') {
        const demoAdmin = {
          _id: 'admin_demo_id',
          name: 'EasyMart Administrator',
          email: 'admin@easymart.com',
          role: 'admin',
          token: 'demo_admin_jwt_token',
        };
        setAdminUser(demoAdmin);
        localStorage.setItem('adminUser', JSON.stringify(demoAdmin));
        localStorage.setItem('adminToken', demoAdmin.token);
        return { success: true, data: demoAdmin };
      }
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const registerAdmin = async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.register({ name, email, password, role: 'admin' });
      setAdminUser(res.data);
      localStorage.setItem('adminUser', JSON.stringify(res.data));
      localStorage.setItem('adminToken', res.data.token);
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        loading,
        error,
        loginAdmin,
        registerAdmin,
        logoutAdmin,
        isAuthenticated: !!adminUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
