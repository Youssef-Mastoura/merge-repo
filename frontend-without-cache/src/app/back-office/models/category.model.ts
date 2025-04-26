import { Course } from './course.model';

export class Category {
  id_Category?: number;
  name_Category!: string;
  courses?: Course[];
}