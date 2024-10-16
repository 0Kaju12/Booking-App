// features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: {
    name: '',
    email: '',
    role: ''
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginData: (state, action) => {
      state.token = action.payload.token;
      state.user = {
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role
      };
      // Optionally, save the token and user data to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = { name: '', email: '', role: '' };
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setLoginData, logout } = authSlice.actions;

export default authSlice.reducer;
