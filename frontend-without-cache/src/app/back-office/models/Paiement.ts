import { Reservation } from "./Reservation";
import { User } from "./user";

export class Paiement {
    idPaiement?: number;
    mode!: string;
    montant!: number;
    date!: string; 
    reservation!: Reservation;
    user!: User; 
  }