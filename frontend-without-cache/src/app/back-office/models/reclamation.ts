import { Reponse } from "./reponse";
import { User } from "./user";

export interface Reclamation {
    idReclamation?: number ;
    //id_User :number;
    type: string; // ou enum si nécessaire
    description: string;
    status: string; // ou enum si nécessaire
    dateSubmitted : Date ;  // Permet null
    solution: string,
    user?: User ,
  reponse : Reponse,
  priorite?: string     
    
  }
  