import { Reclamation } from "./reclamation";

export interface Reponse{
    id: number;
    contenu: string;
    priorite ?: 'LOW' | 'MEDIUM' | 'HIGH';
    dateReponse: Date;
    reclamation?:Reclamation
  }
  