import { CreneauAvecUtilisateur } from './creneau.type';
import { Utilisateur } from './utilisateur.type';

export interface Participation {
  id: string;
  dateCreation: Date;
  utilisateurId: string;
  creneauId: string;
}

export interface ParticipationAvecUtilisateur extends Participation {
  utilisateur: Utilisateur;
}

export interface ParticipationAvecCreneauEtCoParticipants extends Participation {
  creneau: CreneauAvecUtilisateur;
}
