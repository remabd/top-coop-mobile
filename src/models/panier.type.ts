export interface Panier {
  id?: string;
  prix: number;
  dateCreation?: Date;
  utilisateurId?: string;
  produits: ProduitPanier[];
}

export interface ProduitPanier {
  id: string;
  quantite: number;
  unite: Unite;
  prix: number;
  panierId?: string;
  produitId: string;
  nom: string;
}

export interface Produit {
  id: string;
  typeProduitId: string;
  quantite: number;
  dateArrive: Date;
  dateSortie?: Date | null;
  datePeremption?: Date | null;
}

export interface TypeProduit {
  id: string;
  nom: string;
  quantiteMax: number;
  unite: Unite;
  prix: number;
  dateCreation: Date;
}

export interface ProduitAvecType {
  id: string;
  typeProduitId: string;
  quantite: number;
  dateArrive: Date;
  dateSortie?: Date | null;
  datePeremption?: Date | null;
  typeProduit: TypeProduit;
}

export enum Role {
  USER,
  ADMIN,
}

export enum Status {
  AVANT,
  EN_COURS,
  FINI,
}

export enum Unite {
  VRAC,
  UNITE,
}
