import { api, request } from './client';
import { Role } from '../models/panier.type';

export function connexion(data: { email: string; motDePasse: string }) {
  return request<{ access_token: string; role: Role }>(
    api.post('/auth/login', data)
  );
}
