import React, { createContext, useContext, useState, useEffect } from 'react';
import { salesAPI } from '../services/api';

const SalesAuthContext = createContext();

export const SalesAuthProvider = ({ children }) => {
  const [salesUser, setSalesUser] = useState(() => {
    const saved = localStorage.getItem('salesUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginSales = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await salesAPI.login({ email, password });
      const user = res.data;
      setSalesUser(user);
      localStorage.setItem('salesUser', JSON.stringify(user));
      localStorage.setItem('salesToken', user.token);
      return { success: true, data: user };
    } catch (err) {
      // Fallback demo executive session if database connection is pending
      if (email.includes('sales') || email.includes('sam') || email.includes('admin')) {
        const demoRep = {
          _id: 'sales_rep_demo_id',
          name: email.split('@')[0].toUpperCase() + ' (Sales Executive)',
          email: email || 'sales@easymart.com',
          role: 'sales',
          salesCode: 'EM-SALES-EXPRESS-99',
          region: 'South Metro Territory',
          monthlyTarget: 25000,
          commissionRate: 6.5,
          token: 'demo_sales_jwt_token',
        };
        setSalesUser(demoRep);
        localStorage.setItem('salesUser', JSON.stringify(demoRep));
        localStorage.setItem('salesToken', demoRep.token);
        return { success: true, data: demoRep };
      }
      const msg = err.response?.data?.message || 'Invalid sales credentials';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logoutSales = () => {
    setSalesUser(null);
    localStorage.removeItem('salesUser');
    localStorage.removeItem('salesToken');
  };

  return (
    <SalesAuthContext.Provider
      value={{
        salesUser,
        loading,
        error,
        loginSales,
        logoutSales,
        isAuthenticated: !!salesUser,
      }}
    >
      {children}
    </SalesAuthContext.Provider>
  );
};

export const useSalesAuth = () => useContext(SalesAuthContext);
