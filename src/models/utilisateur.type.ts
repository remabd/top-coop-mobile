export enum Role {
  USER,
  ADMIN,
}

export interface Utilisateur {
  id: string;
  role: Role;
  prenom: string;
  nom: string;
  email: string;
  adresse: string;
  codePostal: string;
  ville: string;
  motDePasse: string;
  dateCreation: Date;
}

export interface UtilisateurInfos {
  id: string;
  prenom: string;
  nom: string;
  role: string;
}
