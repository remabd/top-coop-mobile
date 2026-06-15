import { api, request } from './client';
import { loadToken } from '../store/securetoken';
import { Panier } from '../models/panier.type';

export async function demandeValidationPanier(panier: Panier) {
  const token = await loadToken();
  return request<Panier>(
    api.post('/panier', panier, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}
