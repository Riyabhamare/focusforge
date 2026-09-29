import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('focusforge_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('focusforge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Initialize auth state and verify with backend
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('focusforge_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('focusforge_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();

    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('focusforge_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('focusforge_unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('focusforge_token', newToken);
    localStorage.setItem('focusforge_user', JSON.stringify(newUser));
    return newUser;
  };

  const register = async (name, email, password, avatar = 'warrior') => {
    const res = await authApi.register(name, email, password, avatar);
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('focusforge_token', newToken);
    localStorage.setItem('focusforge_user', JSON.stringify(newUser));
    return newUser;
  };

  const demoLogin = async () => {
    const res = await authApi.demoLogin();
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('focusforge_token', newToken);
    localStorage.setItem('focusforge_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('focusforge_token');
    localStorage.removeItem('focusforge_user');
  };

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('focusforge_token');
    if (!storedToken) return null;
    try {
      const res = await authApi.getMe();
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('focusforge_user', JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (err) {
      console.warn('Failed to refresh user:', err);
    }
    return null;
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('focusforge_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        demoLogin,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
