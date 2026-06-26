import { createSlice } from '@reduxjs/toolkit';
import { clearCart } from './cartSlice';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    logout: (state, action) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
    },
  },
});

export const { setCredentials, setLoading, logout } = authSlice.actions;

// Thunk for full logout
export const performLogout = () => (dispatch) => {
  // Clear auth
  dispatch(logout());
  
  // Clear cart
  dispatch(clearCart());

  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('userId');

  // Optionally reload or redirect
  window.location.href = '/login';
};

export default authSlice.reducer;
