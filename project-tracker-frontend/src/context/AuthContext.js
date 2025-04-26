import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
     // undefined = “we haven’t loaded from localStorage yet”
      const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  // On mount, hydrate user from localStorage
  useEffect(() => {
    
        const saved = localStorage.getItem('user');
       setUser(saved ? JSON.parse(saved) : null);
       }, []);

  // LOGIN
  const login = async (username, password) => {
    let users = [];
    try {
      const res = await API.get(`/users?username=${username}`);
      users = res.data;
    } catch (err) {
      console.error('Login fetch error:', err);
    }
    if (users.length === 0) throw new Error('User not found');
    if (users[0].password !== password) throw new Error('Incorrect password');

    const u = users[0];
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    navigate('/');
  };

  // REGISTER
  const register = async ({ username, email, password }) => {
    try {
      const res = await API.post('/users', { username, email, password });
      const u = res.data;
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || 'Registration failed';
      throw new Error(msg);
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

    if (user === undefined) {
    return null; // or a <Spinner /> if you like
    }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
