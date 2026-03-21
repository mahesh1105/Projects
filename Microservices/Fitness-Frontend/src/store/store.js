import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'

// configureStore is used to create the store
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
