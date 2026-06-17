import { api, request } from './client';
import { loadToken } from '../store/securetoken';
import { UtilisateurInfos } from '../models/utilisateur.type';
import { Panier } from '../models/panier.type';
import {
  Participation,
  ParticipationAvecCreneauEtCoParticipants,
} from '../models/participation.type';

export async function chargeInformations() {
  const token = await loadToken();
  return request<UtilisateurInfos>(
    api.get('/utilisateur/informations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}

export async function chargePaniers() {
  const token = await loadToken();
  return request<Panier[]>(
    api.get('/utilisateur/paniers', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}

export async function chargeParticipations() {
  const token = await loadToken();
  return request<ParticipationAvecCreneauEtCoParticipants[]>(
    api.get('/utilisateur/participations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}

export async function demandeAnnulationParticipation(
  participation: Participation
) {
  const token = await loadToken();
  return request<Participation>(
    api.get('/participation/annuler/' + participation.id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}
