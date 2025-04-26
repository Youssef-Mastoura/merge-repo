import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../back-office/models/course.model';
import { Paiement } from '../back-office/models/Paiement';
import { User } from '../back-office/models/user';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private apiUrl = 'http://localhost:8089/skillswap/paiement';


  constructor(private http:HttpClient) { }

  addPaiement(paiement: Paiement): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}/add`, paiement);
  }

  getAllPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/all`);
  }

   getCourseById(id:number) :Observable<Course>
      {
        return this.http.get<Course>("http://localhost:8089/skillswap/courses/getcourses/"+id);
      }
      getUserById(id:number) :Observable<User>
      {
            return this.http.get<User>("http://localhost:8089/skillswap/user/getbyid/"+id);
      }
      
      downloadFacture(id:number): Observable<Blob> {
        return this.http.get(this.apiUrl+"/pdf/facture/"+id, {
          responseType: 'blob'
        });
      }

      sendMessageToChatbot(message: string): Observable<any> {
        const payload = { message: message };
        return this.http.post<any>(this.apiUrl + "/chatbot", payload);
      }
  
}
