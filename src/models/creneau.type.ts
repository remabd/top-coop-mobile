import { ParticipationAvecUtilisateur } from './participation.type';

export interface Creneau {
  id: string;
  nom: string;
  dateCreation: Date;
  dateDebut: Date;
  dateFin: Date;
  description: string | null;
  capacite: number;
}

export interface CreneauAvecUtilisateur extends Creneau {
  participations: ParticipationAvecUtilisateur[];
}
