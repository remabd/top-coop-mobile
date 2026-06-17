import { loadToken } from '../store/securetoken';
import { api, request } from './client';

export async function demandeQuota() {
  const token = await loadToken();
  return request(
    api.get<number>('/utilisateur/quota/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}
