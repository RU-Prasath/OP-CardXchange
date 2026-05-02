import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [services, setServices] = useState([]);
  const [presets, setPresets] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [adminUser, setAdminUser] = useState(localStorage.getItem('adminUser') || null);

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: '/api' });
    instance.interceptors.request.use(cfg => {
      const token = localStorage.getItem('adminToken');
      if (token) cfg.headers.Authorization = `Bearer ${token}`;
      return cfg;
    });
    return instance;
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (e) { console.error(e); }
  }, [api]);

  const fetchPresets = useCallback(async () => {
    try {
      const res = await api.get('/presets');
      setPresets(res.data);
    } catch (e) { console.error(e); }
  }, [api]);

  const fetchTodayOrders = useCallback(async () => {
    try {
      const res = await api.get('/orders/today');
      setTodayOrders(res.data);
    } catch (e) { console.error(e); }
  }, [api]);

  useEffect(() => {
    fetchServices();
    fetchPresets();
    fetchTodayOrders();
    const interval = setInterval(fetchTodayOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchServices, fetchPresets, fetchTodayOrders]);

  const login = async (username, password) => {
    const res = await axios.post('/api/auth/login', { username, password });
    setAdminToken(res.data.token);
    setAdminUser(res.data.username);
    localStorage.setItem('adminToken', res.data.token);
    localStorage.setItem('adminUser', res.data.username);
    return res.data;
  };

  const logout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  const addOrder = async (orderData) => {
    const res = await api.post('/orders', orderData);
    setTodayOrders(prev => [res.data, ...prev]);
    return res.data;
  };

  const updateOrderStatus = async (id, status) => {
    const res = await api.patch(`/orders/${id}/status`, { status });
    setTodayOrders(prev => prev.map(o => o._id === id ? res.data : o));
    return res.data;
  };

  const deleteOrder = async (id) => {
    await api.delete(`/orders/${id}`);
    setTodayOrders(prev => prev.filter(o => o._id !== id));
  };

  return (
    <AppContext.Provider value={{
      services, fetchServices,
      presets, fetchPresets,
      todayOrders, fetchTodayOrders,
      adminToken, adminUser,
      login, logout,
      addOrder, updateOrderStatus, deleteOrder,
      api
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
