import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reponse } from '../back-office/models/reponse';

@Injectable({
  providedIn: 'root'
})
export class ReponseService {
  
  private apiUrl='http://localhost:8089/skillswap/reponses' 
  constructor(private http: HttpClient) { }

  getReponsesByUserId(userId: number): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(`${this.apiUrl}/user/${userId}`);
  }
  
  deleteReponse(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8089/skillswap/reponses/delete/${id}`);
  }

  updateReponse(id: number, reponse: Reponse): Observable<Reponse> {
    return this.http.put<Reponse>(`${this.apiUrl}/${id}`, reponse);
  }
}
