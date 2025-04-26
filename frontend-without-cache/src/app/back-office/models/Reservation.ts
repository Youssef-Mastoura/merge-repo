import { Course } from "./course.model";
import { Paiement } from "./Paiement";
import { User } from "./user";

export class Reservation{
    idReservation?: number; 
    date!: string;           
    status?: number;
    comments!: string;
    course!: Course;
    user!: User;
    paiement!: Paiement;
  }