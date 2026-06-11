import axios from 'axios';

export class AuthApi {
  private baseUrl: string;
  constructor() {
    this.baseUrl = process.env.EXPO_PUBLIC_API_URL + '/auth';
  }

  public async connexion(data: { email: string; motDePasse: string }) {
    return await axios.post(`${this.baseUrl}/login`, data);
  }
}
