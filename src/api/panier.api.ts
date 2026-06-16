import { api, request } from './client';
import { loadToken } from '../store/securetoken';
import {
  ObjetVersPanier,
  Panier,
  TypeProduitVersPanierProduit,
} from '../models/panier.type';

export async function demandeValidationPanier(panier: ObjetVersPanier) {
  const token = await loadToken();
  return request<Panier>(
    api.post('/panier', panier, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}

export async function demandeTypeProduitAvecEan(ean: string) {
  const token = await loadToken();
  return request<TypeProduitVersPanierProduit>(
    api.get('/type-produit/par-ean/' + ean, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}
