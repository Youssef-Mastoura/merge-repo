import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Reclamation } from '../back-office/models/reclamation';

@Injectable({
  providedIn: 'root'
})
export class ReclamtionService {
  private baseUrl = 'http://localhost:8089/skillswap/reclamations';

  constructor(private http: HttpClient) {}
/*

  addReclamation(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(this.addUrl, reclamation, {
      headers: { 'Content-Type': 'application/json' }  // Ajoutez cet en-tête
    }).pipe(
      catchError(error => {
        // Personnalisez l'erreur ici
        console.error('Erreur lors de l\'ajout de la réclamation :', error);
        return throwError(() => new Error(error.message || 'Erreur inconnue'));
      })
    );
  }
*/

getByPriority(priority: string): Observable<Reclamation[]> {
  return this.http.get<Reclamation[]>(`${this.baseUrl}/by-priority/${priority}`);}
  analyzePriority(description: string): Observable<string> {
    return this.http.post<string>('http://localhost:8089/skillswap/reclamations/analyze-priority', description, {
      headers: { 'Content-Type': 'text/plain' }
});
  }

  addReclamation(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(`${this.baseUrl}/addreclamation`, reclamation)
      .pipe(
        catchError(error => {
          throw new Error('Erreur lors de l\'ajout: ' + error.message);
        })
      );
  }



}
