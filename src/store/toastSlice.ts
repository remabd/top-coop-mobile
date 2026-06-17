import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { NiveauToast } from '../components/Toast';

interface ToastState {
  id: number;
  message: string;
  niveau: NiveauToast;
  visible: boolean;
}

const initialState: ToastState = {
  id: 0,
  message: '',
  niveau: 'ok',
  visible: false,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    afficheToast: (
      state,
      action: PayloadAction<{ message: string; niveau?: NiveauToast }>
    ) => {
      state.id += 1;
      state.message = action.payload.message;
      state.niveau = action.payload.niveau ?? 'ok';
      state.visible = true;
    },
    cacheToast: (state) => {
      state.visible = false;
    },
  },
});

export const { afficheToast, cacheToast } = toastSlice.actions;
export const toastSelector = (s: RootState) => s.toast;
export default toastSlice.reducer;
