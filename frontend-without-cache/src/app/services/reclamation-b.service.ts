import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Reclamation } from '../back-office/models/reclamation';


@Injectable({
  providedIn: 'root',
})
export class ReclamationService {
  private apiUrl = 'http://localhost:8089/skillswap/reclamations/getall';
  private deleteUrl = 'http://localhost:8089/skillswap/reclamations/deletereclamation/';
private baseUrl = 'http://localhost:8089/skillswap/reclamations/status'
  constructor(private http: HttpClient) {}

  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.apiUrl);
  }

  deleteReclamation(id: number): Observable<any> {
    return this.http.delete(`${this.deleteUrl}${id}`).pipe(
      catchError(error => {
        // Log détaillé de l'erreur
        console.error('Erreur lors de la suppression :', error);
        // Retourner l'erreur pour pouvoir la gérer dans le composant
        return throwError(() => new Error(error));
      })
    );
  }


  getByStatus(status: string): Observable<any> {
    return this.http.get(`http://localhost:8089/skillswap/reclamations/status/${status}`);
  }

  getStatsByType(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>('http://localhost:8089/skillswap/reclamations/stats');
  }
    }


 

  
