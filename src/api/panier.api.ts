import { api, request } from './client';
import { loadToken } from '../store/securetoken';
import {
  DtoVersPanierUtilisateur,
  Panier,
  TypeProduitVersPanierProduit,
} from '../models/panier.type';

export async function demandeValidationPanier(
  panier: DtoVersPanierUtilisateur
) {
  const token = await loadToken();
  return request<Panier>(
    api.post('/panier/utilisateur', panier, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}

// Le backend sérialise les prix décimaux en chaîne ("3.50"). On les
// reconvertit en nombre dès la frontière API pour que le reste de
// l'application puisse se fier au type `number`.
function normaliseProduit(
  produit: TypeProduitVersPanierProduit
): TypeProduitVersPanierProduit {
  return {
    ...produit,
    prix: Number(produit.prix),
    typeProduit: {
      ...produit.typeProduit,
      prix: Number(produit.typeProduit.prix),
    },
  };
}

export async function demandeTypeProduitAvecEan(ean: string) {
  const token = await loadToken();
  const resultat = await request<TypeProduitVersPanierProduit>(
    api.get('/type-produit/par-ean/' + ean, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
  return resultat.ok
    ? { ...resultat, data: normaliseProduit(resultat.data) }
    : resultat;
}
