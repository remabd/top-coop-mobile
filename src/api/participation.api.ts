import { loadToken } from '../store/securetoken';
import { api, request } from './client';

export interface Creneau {
  id: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  description?: string | null;
  capacite: number;
}

export interface Participation {
  id?: string;
  utilisateurId: string;
  creneauId: string;
  dateCreation?: string;
}

export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
}

async function authHeaders() {
  const token = await loadToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function fetchCreneaux() {
  return request<Creneau[]>(
    api.get('/creneau', { headers: await authHeaders() })
  );
}

export async function fetchParticipations() {
  return request<Participation[]>(
    api.get('/participation', { headers: await authHeaders() })
  );
}

export async function fetchUtilisateurs() {
  return request<Utilisateur[]>(
    api.get('/utilisateur', { headers: await authHeaders() })
  );
}

export async function creeParticipation(
  creneauId: string,
  utilisateurId: string
) {
  return request<Participation>(
    api.post(
      '/participation',
      { utilisateurId, creneauId },
      { headers: await authHeaders() }
    )
  );
}

export async function demandeQuota() {
  return request(
    api.get<number>('/utilisateur/quota/', { headers: await authHeaders() })
  );
}
