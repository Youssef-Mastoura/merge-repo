import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Content } from '../back-office/models/content.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = 'http://localhost:8089/skillswap/contents'; // URL de base de l'API

  constructor(private http: HttpClient) { }

  getContentsByCourseId(courseId: number): Observable<Content[]> {
    return this.http.get<Content[]>(`${this.apiUrl}/course/${courseId}`);
  }

  addContent(content: Content, courseId: number): Observable<Content> {
    return this.http.post<Content>(`${this.apiUrl}/course/${courseId}/addContent`, content);

  }
  

  updateContent(content: Content): Observable<Content> {
    return this.http.put<Content>(`${this.apiUrl}/${content.id_Content}`, content);
  }

  deleteContent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}