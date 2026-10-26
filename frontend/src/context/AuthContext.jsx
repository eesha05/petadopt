import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pet_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('pet_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('pet_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('pet_user', JSON.stringify(res.data));
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const params = new URLSearchParams();
    params.append('username', email.trim());
    params.append('password', password);

    const res = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, user: loggedUser } = res.data;
    localStorage.setItem('pet_token', access_token);
    localStorage.setItem('pet_user', JSON.stringify(loggedUser));
    setToken(access_token);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    // After registration, auto-login
    return await login(userData.email, userData.password);
  };

  const logout = () => {
    localStorage.removeItem('pet_token');
    localStorage.removeItem('pet_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    setUser(res.data);
    localStorage.setItem('pet_user', JSON.stringify(res.data));
    return res.data;
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
