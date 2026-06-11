import * as SecureStore from 'expo-secure-store';
const KEY = 'auth_token';

export const saveToken = (t: string) => SecureStore.setItemAsync(KEY, t);
export const loadToken = () => SecureStore.getItemAsync(KEY);
export const clear = () => SecureStore.deleteItemAsync(KEY);
