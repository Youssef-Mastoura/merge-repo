import { registration } from '../../registration';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { myevent } from '../../event'; 
import { User } from 'src/app/back-office/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { catchError } from 'rxjs/operators'; // Correct import for catchError



@Injectable({
  providedIn: 'root'
})
export class EventserviceServicef {

  private baseUrl = 'http://localhost:8089/skillswap/event'; 

  constructor(private http: HttpClient) { }
  
  getEvent(id: number): Observable<myevent> {
    return this.http.get<myevent>(`${this.baseUrl}/get-Eventbyid/${id}`); 
  }
  createEvent(event: myevent): Observable<myevent> {
    return this.http.post<myevent>(`${this.baseUrl}/addEvent`, event); 
  }
  updateEvent(id: number, event: myevent): Observable<myevent> {
    return this.http.put<myevent>(`${this.baseUrl}/updateEvent`, event); 
  }
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteEvent/${id}`); 
  }
  getAllEvents(): Observable<myevent[]> {
    return this.http.get<myevent[]>(`${this.baseUrl}/getAllEvent`); 
  }
register(registration: registration, userId: number, eventId: number): Observable<registration> {
  return this.http.post<registration>(`http://localhost:8089/skillswap/eventregistration/add_registration_with_user_and_event/${userId}/${eventId}`, registration);
}

rating (eventId: number): Observable<any> {
  return this.http.get<any>(`http://localhost:8089/skillswap/feedback/get_sum_feedback/${eventId}`);
}

participants(eventId: number): Observable<User[]> {
  return this.http.get<User[]>(`http://localhost:8089/skillswap/eventregistration/get_participants/${eventId}`);
}

registrations_user(userId: number): Observable<myevent[]> {
  return this.http.get<myevent[]>(`http://localhost:8089/skillswap/event/get_user_events/${userId}`);

}
checkregistration(userId:number, eventId:number):Observable<boolean>{
  return this.http.get<any>(`http://localhost:8089/skillswap/eventregistration/checkRegistration/${userId}/${eventId}`)
}

// API service 
private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
private readonly apiKey = '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'; // Replace with your actual key

sendMessage(messages: any[]): Observable<any> {
  // 1. Set headers
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.apiKey}`, // Using backticks (`) for template literal
    'Content-Type': 'application/json'
  });

  // 2. Prepare request body
  const body = {
    model: 'llama3-8b-8192', // Recommended working model
    messages: messages,
    temperature: 0.7
  };

  // 3. Make the POST request
  return this.http.post(this.apiUrl, body, { headers }).pipe(
    // Proper error handling
    catchError(error => {
      console.error('API Error:', error);
      return throwError(() => new Error('Failed to get AI response'));
    })
  );
}

}