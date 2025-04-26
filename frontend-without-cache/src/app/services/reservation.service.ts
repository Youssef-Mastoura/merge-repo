import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../back-office/models/course.model';
import { Reservation } from '../back-office/models/Reservation';
import { User } from '../back-office/models/user';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  panier: number=0
  

  private apiUrl = 'http://localhost:8089/skillswap/reservation';

  constructor(private http: HttpClient) {}

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/add`, reservation);
  }

  updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/update`, reservation);
  }

  deleteReservation(id: number): Observable<Reservation> {
    return this.http.delete<Reservation>(`${this.apiUrl}/delete/${id}`);
  }


  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/all`);
  }

  

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/get/${id}`);
  }


  getUserById(id:number) :Observable<User>
    {
      return this.http.get<User>("http://localhost:8089/skillswap/user/getbyid/"+id);
    }

    getCourseById(id:number) :Observable<Course>
    {
      return this.http.get<Course>("http://localhost:8089/skillswap/courses/"+id);
    }

    getReservationsByUserId(userId: number): Observable<Reservation[]> {
      return this.http.get<Reservation[]>(`${this.apiUrl}/reservationByUser/${userId}`);
    }
  
}
