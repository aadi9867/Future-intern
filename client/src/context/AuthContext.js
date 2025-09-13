import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Token exists but no user data, fetch profile
            const response = await authService.getProfile();
            if (response.success) {
              setUser(response.data.student);
            } else {
              authService.logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register new user
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.student));
        setUser(response.data.student);
        
        return {
          success: true,
          data: response.data,
          warning: response.warning
        };
      }
      
      return response;
    } catch (error) {
      setError(error.message || 'Registration failed');
      throw error;
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      
      if (response.success) {
        setUser(response.data.student);
        return response;
      }
      
      return response;
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  // Check email availability
  const checkEmail = async (email) => {
    try {
      const response = await authService.checkEmail(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await authService.getProfile();
      
      if (response.success) {
        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return response;
      }
      
      return response;
    } catch (error) {
      setError(error.message || 'Failed to update profile');
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    checkEmail,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 