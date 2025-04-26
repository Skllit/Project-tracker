import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const nav = useNavigate();
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (u, p) => {
    const res = await API.get(`/users?username=${u}`);
    const usr = res.data[0];
    if (!usr) throw new Error('User not found');
    if (usr.password !== p) throw new Error('Incorrect password');
    setUser(usr);
    localStorage.setItem('user', JSON.stringify(usr));
    nav('/');
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

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
