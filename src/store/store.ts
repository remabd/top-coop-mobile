import { configureStore } from '@reduxjs/toolkit';
import panierReducer from './panierSlice';
import authReducer from './authSlice';
import toastReducer from './toastSlice';

export const store = configureStore({
  reducer: {
    panier: panierReducer,
    auth: authReducer,
    toast: toastReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
