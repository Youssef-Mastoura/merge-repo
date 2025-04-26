import { Injectable } from '@angular/core';
import { Review } from '../models/review';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8089/pi_cloud/api/reviews';

  constructor(private http: HttpClient) {}

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }
}
