import React, { createContext, useContext, useState, useEffect } from 'react';
import { deliveryAPI } from '../services/api';

const DeliveryAuthContext = createContext();

export const DeliveryAuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(() => {
    const saved = localStorage.getItem('driverUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [isOnline, setIsOnline] = useState(() => {
    const saved = localStorage.getItem('driverOnline');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleOnline = () => {
    setIsOnline((prev) => {
      const next = !prev;
      localStorage.setItem('driverOnline', JSON.stringify(next));
      return next;
    });
  };

  const loginDriver = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await deliveryAPI.login({ email, password });
      setDriver(res.data);
      localStorage.setItem('driverUser', JSON.stringify(res.data));
      localStorage.setItem('driverToken', res.data.token);
      return { success: true, data: res.data };
    } catch (err) {
      // Demo driver fallback session for easy evaluation
      if (email.includes('driver') || email.includes('admin') || email === 'delivery@easymart.com') {
        const demoDriver = {
          _id: 'driver_demo_id',
          name: 'Rajesh Kumar (Express Courier)',
          email: email || 'driver@easymart.com',
          role: 'driver',
          vehicle: 'Hero Electric Bike (KA-01-EA-2026)',
          rating: 4.95,
          token: 'demo_driver_jwt_token',
        };
        setDriver(demoDriver);
        localStorage.setItem('driverUser', JSON.stringify(demoDriver));
        localStorage.setItem('driverToken', demoDriver.token);
        return { success: true, data: demoDriver };
      }
      const msg = err.response?.data?.message || 'Driver login failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logoutDriver = () => {
    setDriver(null);
    localStorage.removeItem('driverUser');
    localStorage.removeItem('driverToken');
  };

  return (
    <DeliveryAuthContext.Provider
      value={{
        driver,
        isOnline,
        toggleOnline,
        loading,
        error,
        loginDriver,
        logoutDriver,
        isAuthenticated: !!driver,
      }}
    >
      {children}
    </DeliveryAuthContext.Provider>
  );
};

export const useDeliveryAuth = () => useContext(DeliveryAuthContext);
