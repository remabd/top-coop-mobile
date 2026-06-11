import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export enum AuthStatut {
  CHARGEMENT,
  CONNECTE,
  NON_CONNECTE,
}

interface AuthState {
  token: string | null;
  statut: AuthStatut;
}

const initialState: AuthState = { token: null, statut: AuthStatut.CHARGEMENT };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    connexion: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.statut = AuthStatut.CONNECTE;
    },
    deconnexion: (state) => {
      state.token = null;
      state.statut = AuthStatut.NON_CONNECTE;
    },
    estDeconnecte: (state) => {
      state.statut = AuthStatut.NON_CONNECTE;
    },
  },
});

export const { connexion, deconnexion, estDeconnecte } = authSlice.actions;
export const authSelector = (s: RootState) => s.auth;
export default authSlice.reducer;
