import { registration } from '../../registration';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { myevent } from '../../event';
import { User } from 'src/app/back-office/models/user';

@Injectable({
  providedIn: 'root'
})
export class EventserviceService {

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

getregistrationsevent(eventId: number): Observable<registration[]> {
  return this.http.get<registration[]>(`http://localhost:8089/skillswap/eventregistration/get_all_registration/${eventId}`);
}

getregistrationuser(registrationId: number): Observable<User> {
  return this.http.get<User>(`http://localhost:8089/skillswap/eventregistration/getregistrationuser/${registrationId}`);
}

deleteregistraion(registrationId: number): Observable<void> {
  return this.http.delete<void>(`http://localhost:8089/skillswap/eventregistration/deleteEventRegistration/${registrationId}`);
}

mailing(userId: number, eventId: number, htmlContent?: string): Observable<string> {
  return this.http.post(
    `${this.baseUrl}/send_event_notification/${userId}/${eventId}`,
    null,
    { responseType: 'text' as const }  
  );
}


}