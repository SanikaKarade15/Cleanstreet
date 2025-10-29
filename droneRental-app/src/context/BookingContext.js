import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

// Initial state
const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null
};

// Action types
const BOOKING_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  GET_BOOKINGS: 'GET_BOOKINGS',
  GET_BOOKING: 'GET_BOOKING',
  CREATE_BOOKING: 'CREATE_BOOKING',
  UPDATE_BOOKING: 'UPDATE_BOOKING',
  DELETE_BOOKING: 'DELETE_BOOKING',
  BOOKING_ERROR: 'BOOKING_ERROR',
  CLEAR_BOOKING: 'CLEAR_BOOKING',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const bookingReducer = (state, action) => {
  switch (action.type) {
    case BOOKING_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: true
      };
    
    case BOOKING_ACTIONS.GET_BOOKINGS:
      return {
        ...state,
        bookings: action.payload,
        loading: false
      };
    
    case BOOKING_ACTIONS.GET_BOOKING:
      return {
        ...state,
        currentBooking: action.payload,
        loading: false
      };
    
    case BOOKING_ACTIONS.CREATE_BOOKING:
      return {
        ...state,
        bookings: [action.payload, ...state.bookings],
        currentBooking: action.payload,
        loading: false
      };
    
    case BOOKING_ACTIONS.UPDATE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id ? action.payload : booking
        ),
        currentBooking: action.payload,
        loading: false
      };
    
    case BOOKING_ACTIONS.DELETE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking.id !== action.payload),
        currentBooking: null,
        loading: false
      };
    
    case BOOKING_ACTIONS.BOOKING_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case BOOKING_ACTIONS.CLEAR_BOOKING:
      return {
        ...state,
        currentBooking: null
      };
    
    case BOOKING_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const BookingContext = createContext();

// Provider component
export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Get all bookings for current user
  const getBookings = async () => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING });
      const response = await api.get('/api/bookings/all/bookings');
      dispatch({
        type: BOOKING_ACTIONS.GET_BOOKINGS,
        payload: response.data
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch bookings';
      dispatch({
        type: BOOKING_ACTIONS.BOOKING_ERROR,
        payload: message
      });
      toast.error(message);
    }
  };
  

  // Get single booking by ID
  const getBooking = async (id) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING });
      const response = await api.get(`/api/bookings/${id}`);
      dispatch({
        type: BOOKING_ACTIONS.GET_BOOKING,
        payload: response.data
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch booking';
      dispatch({
        type: BOOKING_ACTIONS.BOOKING_ERROR,
        payload: message
      });
      toast.error(message);
    }
  };

  // Create new booking
  const createBooking = async (bookingData) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING });
      const response = await api.post('/api/bookings', bookingData);
      dispatch({
        type: BOOKING_ACTIONS.CREATE_BOOKING,
        payload: response.data
      });
      toast.success('Booking created successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create booking';
      dispatch({
        type: BOOKING_ACTIONS.BOOKING_ERROR,
        payload: message
      });
      toast.error(message);
      return null;
    }
  };

  // Update booking
  const updateBooking = async (id, bookingData) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING });
      const response = await api.put(`/api/bookings/${id}`, bookingData);
      dispatch({
        type: BOOKING_ACTIONS.UPDATE_BOOKING,
        payload: response.data
      });
      toast.success('Booking updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update booking';
      dispatch({
        type: BOOKING_ACTIONS.BOOKING_ERROR,
        payload: message
      });
      toast.error(message);
      return null;
    }
  };

  // Delete booking
  const deleteBooking = async (id) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING });
      await api.delete(`/api/bookings/${id}`);
      dispatch({
        type: BOOKING_ACTIONS.DELETE_BOOKING,
        payload: id
      });
      toast.success('Booking cancelled successfully!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel booking';
      dispatch({
        type: BOOKING_ACTIONS.BOOKING_ERROR,
        payload: message
      });
      toast.error(message);
      return false;
    }
  };

  // Clear current booking
  const clearBooking = () => {
    dispatch({ type: BOOKING_ACTIONS.CLEAR_BOOKING });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: BOOKING_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    bookings: state.bookings,
    currentBooking: state.currentBooking,
    loading: state.loading,
    error: state.error,
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
    clearBooking,
    clearError
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook to use booking context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}; 