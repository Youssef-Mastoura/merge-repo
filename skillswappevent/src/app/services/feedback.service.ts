import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { feedback } from '../feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private baseUrl = 'http://localhost:8089/skillswap/feedback';

  constructor(private http: HttpClient) {}

  addEventFeedback(userId: number, eventId: number, feedback: feedback): Observable<feedback> {
    return this.http.post<feedback>(`${this.baseUrl}/add_feedback_with_user_and_event/${userId}/${eventId}`, feedback);
  
  }
}