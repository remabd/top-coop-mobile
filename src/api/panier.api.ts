import axios from 'axios';
import { Panier } from '../models/panier.type';

export class PanierApi {
  private token: string;
  private baseUrl: string;
  constructor() {
    this.token = '';
    this.baseUrl = process.env.EXPO_PUBLIC_API_URL + '/panier';
  }

  public async validePanier(panier: Panier) {
    try {
      const response = await axios.post<Panier>('/', panier, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response;
    } catch (e) {
      console.log(e);
    }
  }
}
