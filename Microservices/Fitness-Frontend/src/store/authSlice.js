import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.userId = action.payload.user.sub

      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(state.user))
      localStorage.setItem('userId', state.userId)
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.userId = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userId')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
