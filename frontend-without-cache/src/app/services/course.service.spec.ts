import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl: string = 'http://localhost:8089/skillswap/courses';

  constructor(private http: HttpClient) {}

  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/addcours`, course);
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl);
  }
}
