export interface Panier {
  id: string;
  prix: number;
  dateCreation: Date;
  utilisateurId: string;
  produits: ProduitPanier[];
}

export interface ObjetVersPanier {
  prix: number;
  produits: TypeProduitVersPanierProduit[];
}

export interface DtoVersProduitPanierUtilisateur {
  typeProduitId: string;
  quantite: number;
}

export interface DtoVersPanierUtilisateur {
  prix: number;
  produits: DtoVersProduitPanierUtilisateur[];
}

export interface TypeProduitVersPanierProduit {
  typeProduit: TypeProduit;
  quantite: number;
  unite: Unite;
  prix: number;
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

export enum Unite {
  VRAC = 'VRAC',
  UNITE = 'UNITE',
}
