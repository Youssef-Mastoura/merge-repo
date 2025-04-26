import { Injectable } from '@angular/core';
import { Review } from '../back-office/models/review';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'http://localhost:8089/skillswap/api/reviews';  // Changez l'URL en fonction de votre API backend

  constructor(private http: HttpClient) { }
  /*
  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl);
  }
  */

  getAverageRating(): Observable<number> {
    return this.http.get<number>('http://localhost:8089/skillswap/api/reviews/average');
  }
  

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }
  updateReview(id: number, review: Review): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, review);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  
  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>('http://localhost:8089/skillswap/api/reviews');
  }
}
