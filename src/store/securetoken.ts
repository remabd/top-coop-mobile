import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEY = 'auth_token';

// expo-secure-store n'est pas disponible sur le web : on retombe sur
// localStorage pour que l'authentification fonctionne aussi dans le navigateur.
const isWeb = Platform.OS === 'web';

export const saveToken = (t: string) =>
  isWeb
    ? Promise.resolve(localStorage.setItem(KEY, t))
    : SecureStore.setItemAsync(KEY, t);

export const loadToken = (): Promise<string | null> =>
  isWeb
    ? Promise.resolve(localStorage.getItem(KEY))
    : SecureStore.getItemAsync(KEY);

export const clear = () =>
  isWeb
    ? Promise.resolve(localStorage.removeItem(KEY))
    : SecureStore.deleteItemAsync(KEY);
