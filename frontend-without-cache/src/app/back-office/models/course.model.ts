import { Category } from './category.model';
import { Content } from './content.model';
import { User } from './user';

export enum CourseType {
  ONLINE = "ONLINE",
  LIVE = "LIVE"
}

export class Course {
  id_Course?: number;
  title_Course!: string;
  description_Course!: string;
  language_Course!: string;
  price_Course!: number;
  duration_Course!: number;
  createdAt_Course?: Date;
  name_Category?: string;
  rating_Course?: number;
  courseType?: CourseType;
  sessionDate?: Date;
  sessionDates?: Date[];
  teacherId?: number; 
   categories?: Category[];
  contents?: Content[];
  image_Course?: string; 
  level_Course?:string;
  prerequisites_Course?:string;
 score_Course?:number ;
 viewedCount?: number; // Ajouter pour le tracking des vues
 progress?: number;}