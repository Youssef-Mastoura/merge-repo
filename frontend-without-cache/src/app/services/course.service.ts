import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../back-office/models/course.model';
import { Content } from '../back-office/models/content.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://localhost:8089/skillswap/courses';

  constructor(private http: HttpClient) { }

  /* Méthodes existantes (conservées telles quelles) */
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`);
  }

  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/addcours`, course);
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}`, course);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getCoursesByCategory(categoryName: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/category/${categoryName}`);
  }
  
  getCoursesByProfessor(professorId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/professor/${professorId}`);
  }

  rateCourse(courseId: number, rating: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${courseId}/${rating}`, null, {
      params: { rating: rating.toString() }
    });
  }

  getPopularCourses(limit: number = 5): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/popular?limit=${limit}`);
  }
  
  incrementViewCount(courseId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${courseId}/view`, null);
  }

  /* Nouvelles méthodes ajoutées */
  findByTeacherId(teacherId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/teacher/${teacherId}`);
  }

  findByStudentId(studentId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/student/${studentId}`);
  }

createCourse(course: Course, teacherId: number): Observable<Course> {
  return this.http.post<Course>(`${this.baseUrl}/teacher/${teacherId}`, course);
}

  enrollStudent(courseId: number, studentId: number): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/${courseId}/enroll/${studentId}`, null);
  }

  unenrollStudent(courseId: number, studentId: number): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/${courseId}/unenroll/${studentId}`, null);
  }

  searchCourses(keyword: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/search`, {
      params: { keyword }
    });
  }

  addContentToCourse(courseId: number, content: Content): Observable<Content> {
    return this.http.post<Content>(`${this.baseUrl}/${courseId}/addContent`, content);
  }
  getCoursesByTeacher(teacherId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/teacher/${teacherId}`);
  }
  
  getCoursesByStudent(studentId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/student/${studentId}`);
  }
  
  // Dans votre course.service.ts
getStudentCourses(studentId: number): Observable<Course[]> {
  // Implémentez la logique pour récupérer les cours d'un étudiant
  // Par exemple :
  return this.http.get<Course[]>(`${this.baseUrl}/students/${studentId}/courses`);
}
}