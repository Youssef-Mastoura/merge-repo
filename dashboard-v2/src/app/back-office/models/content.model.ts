export class Content {
  id_Content!: number;
  title_Content!: string;
  description_Content!: string;
  url_Content!: string;
  duration_Content!: number;
  orderIndex_Content!: number;
  type_Content!: string;
  courseId!:number; // Pour permettre l'association avec un cours
  teacherId?: number
}