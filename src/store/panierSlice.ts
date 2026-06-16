import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ObjetVersPanier } from '../models/panier.type';
import { RootState } from './store';

interface PanierState {
  value: ObjetVersPanier;
}

const initialState: PanierState = {
  value: {
    prix: 0,
    produits: [],
  },
};

const panierSlice = createSlice({
  name: 'panier',
  initialState,
  reducers: {
    modifiePanier: (state, action: PayloadAction<ObjetVersPanier>) => {
      state.value = action.payload;
    },
  },
});

export const { modifiePanier } = panierSlice.actions;
export const panierSelector = (state: RootState) => state.panier.value;
export default panierSlice.reducer;
