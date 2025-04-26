import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const nav = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('user');
    setUser(saved ? JSON.parse(saved) : null);
  }, []);

    const login = async (username, password) => {
        try {
          const res = await API.post('/auth/login', { username, password });
          const u = res.data;
          setUser(u);
          localStorage.setItem('user', JSON.stringify(u));
          navigate('/');
        } catch (err) {
          // bubble up the error message from the server
          throw new Error(err.response?.data?.message || 'Login failed');
        }
      };

  const register = async data => {
    const res = await API.post('/users', data);
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
    nav('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    nav('/login');
  };

  if (user === undefined) return null;
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
