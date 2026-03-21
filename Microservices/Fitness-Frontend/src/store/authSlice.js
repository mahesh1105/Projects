import { createSlice } from '@reduxjs/toolkit'

// createSlice - A function that accepts a "slice name", an initial state, and an object of reducer functions
// A reducer is a pure function that takes the (previous state and an action) as arguments, and returns the next state.
const authSlice = createSlice({
  name: 'auth',
  initialState : {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null
  },
  reducers: {
    // Set the states
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.userId = action.payload.user.sub;

      localStorage.setItem('token', state.token);
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('userId', state.userId);
    },
    // Unset the states
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.userId = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    }
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer