import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { feedback } from '../../feedback';
import { myevent } from '../../event';

@Injectable({
  providedIn: 'root'
})
export class FeedbackeventfService {
  private baseUrl = 'http://localhost:8089/skillswap/feedback';

  constructor(private http: HttpClient) {}

  addEventFeedback(userId: number, eventId: number, feedback: feedback): Observable<feedback> {
    return this.http.post<feedback>(`${this.baseUrl}/add_feedback_with_user_and_event/${userId}/${eventId}`, feedback);
  }

  showtop_5(): Observable<myevent[]> {
    return this.http.get<myevent[]>(`${this.baseUrl}/get_top_5_rated_event`);
  }

  checkfeedback(userId:number, eventId:number):Observable<boolean>{
    return this.http.get<any>(`http://localhost:8089/skillswap/feedback/checkFeedback/${userId}/${eventId}`)
  }

}