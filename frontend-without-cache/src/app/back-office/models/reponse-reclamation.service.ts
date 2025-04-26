import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reponse } from '../models/reponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReponseReclamationService {

  private apiUrl = 'http://localhost:8089/pi_cloud/reponses';

  constructor(private http: HttpClient) {}

  addReponse(reponse: Reponse, reclamationId: number): Observable<Reponse> {
    return this.http.post<Reponse>(`${this.apiUrl}/add/${reclamationId}`, reponse);
  }
}
