import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { feedback } from '../../feedback';
import { myevent } from '../../event';
import { User } from 'src/app/back-office/models/user';


@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private baseUrl = 'http://localhost:8089/skillswap/feedback';

  constructor(private http: HttpClient) {}

  addEventFeedback(userId: number, eventId: number, feedback: feedback): Observable<feedback> {
    return this.http.post<feedback>(`${this.baseUrl}/add_feedback_with_user_and_event/${userId}/${eventId}`, feedback);
  }

  showtop_5(): Observable<myevent[]> {
    return this.http.get<myevent[]>(`${this.baseUrl}/get_top_5_rated_event`);
  }

  getfeedbacksevent(eventId:number):Observable<feedback[]>{
    return this.http.get<feedback[]>(`${this.baseUrl}/get_all_feedbacks/${eventId}`);
    }

  getfeedbackuser(feedbackId: number):Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/getfeedbackuser/${feedbackId}`);
  }
}