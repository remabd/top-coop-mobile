import { configureStore } from '@reduxjs/toolkit';
import panierReducer from './panierSlice';

export const store = configureStore({
  reducer: {
    panier: panierReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
