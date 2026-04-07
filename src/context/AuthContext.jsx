import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.getProfile();
        if (response.success) {
          setUser(response.data);
        } else {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.login(email, password);
    if (response.success) {
      setUser(response.data.data); // Backend returns the user in 'data'
      localStorage.setItem('token', response.data.token);
      return { success: true };
    }
    return response;
  };

  const register = async (userData) => {
    const response = await api.register(userData);
    if (response.success) {
      setUser(response.data.data); // Backend returns the user in 'data' after registration fix
      localStorage.setItem('token', response.data.token);
      return { success: true };
    }
    return response;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async (updates, avatarFile) => {
    const response = await api.updateProfile(updates.bio, avatarFile);
    if (response.success) {
      const profileResponse = await api.getProfile();
      if (profileResponse.success) {
        setUser(profileResponse.data);
      }
      return { success: true };
    }
    return response;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

