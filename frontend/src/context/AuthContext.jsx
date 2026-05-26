import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('task_user');
    const token = localStorage.getItem('task_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const data = await api.login(username, password);
      // data contains: token, type, id, username, email
      const userData = { id: data.id, username: data.username, email: data.email };
      localStorage.setItem('task_token', data.token);
      localStorage.setItem('task_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const register = async (username, email, password) => {
    try {
      await api.register(username, email, password);
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('task_token');
    localStorage.removeItem('task_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
