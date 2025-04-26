import { User } from "./user";

export interface Review {
   // comment: any;
        id?: number; // ID est facultatif, car il sera généré par le backend
        username?: string;
        content: string;
        rating: number;
        user :User;
      }
      