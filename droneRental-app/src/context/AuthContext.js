import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import {jwtDecode} from 'jwt-decode';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  token: localStorage.getItem('token') || null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
  LOGOUT: 'LOGOUT',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAIL: 'REGISTER_FAIL',
  USER_LOADED: 'USER_LOADED',
  AUTH_ERROR: 'AUTH_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  // ✅ Add this new action
  UPDATE_USER: 'UPDATE_USER'
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      const user = action.payload.user ? action.payload.user : (() => {
        const decoded = jwtDecode(action.payload.token);
        return {
          role: decoded.role,
          name: decoded.sub,
          email: decoded.sub,
          id: decoded.userId
        };
      })();
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        user: user
      };
    
    case AUTH_ACTIONS.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    
    // ✅ Add this new case
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case AUTH_ACTIONS.LOGIN_FAIL:
    case AUTH_ACTIONS.REGISTER_FAIL:
    case AUTH_ACTIONS.AUTH_ERROR:
    case AUTH_ACTIONS.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    loadUser();
  }, []);

  // ✅ Updated loadUser function to extract ALL fields
  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
        return;
      }

      // Set auth token header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await api.get('/api/users/profile');
      console.log('Profile response:', response.data);

      // ✅ Extract ALL user fields including phone and address
      const user = {
        id: response.data.id,
        role: response.data.role,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,    // ✅ Added missing field
        address: response.data.address // ✅ Added missing field
      };
      
      dispatch({
        type: AUTH_ACTIONS.USER_LOADED,
        payload: user
      });
    } catch (error) {
      console.error('Error loading user:', error);
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/users/auth/login', {
        email,
        password
      });

      // Set auth token header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      // ✅ Fetch complete user profile including phone and address
      const profileResponse = await api.get('/api/users/profile');
      const userProfile = profileResponse.data;

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          token: response.data.token,
          user: {
            id: userProfile.id,
            role: userProfile.role,
            name: userProfile.name,
            email: userProfile.email,
            phone: userProfile.phone,    // ✅ Added missing field
            address: userProfile.address // ✅ Added missing field
          }
        }
      });

      toast.success('Login successful!');
      return { success: true, role: userProfile.role };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAIL });
      return { success: false, role: null };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const response = await api.post('/api/users/auth/register', userData);
      toast.success('Registration successful! Please login.');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      dispatch({ type: AUTH_ACTIONS.REGISTER_FAIL });
      return false;
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    delete api.defaults.headers.common['Authorization'];
    toast.info('Logged out successfully');
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // ✅ Add the missing updateUser function
  const updateUser = (updatedUserData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: updatedUserData
    });
  };

  // ✅ Add updateUser to the context value
  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    token: state.token,
    login,
    register,
    logout,
    clearError,
    loadUser,
    updateUser // ✅ Added missing function
  };

  return (
    <AuthContext.Provider value={value}>
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
