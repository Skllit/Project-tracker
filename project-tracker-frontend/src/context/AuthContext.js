import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (username, password) => {
    const res = await API.get(`/users?username=${username}`);
    const u = res.data[0];
    if (!u) throw new Error('User not found');
    if (u.password !== password) throw new Error('Incorrect password');
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    navigate('/');
  };

  const register = async (data) => {
    const res = await API.post('/users', data);
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
    navigate('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Export useAuth OUTSIDE the component, not inside
export const useAuth = () => {
  return useContext(AuthContext);
};
