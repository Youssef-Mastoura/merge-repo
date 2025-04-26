import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompteBancaire } from '../back-office/models/CompteBancaire';
import { User } from '../back-office/models/user';

@Injectable({
  providedIn: 'root'
})
export class ComptebancaireService {

  private url:string='http://localhost:8089/skillswap/comptebancaire';

  constructor(private http:HttpClient) { }

  getAllCompteBancaire() :Observable<CompteBancaire[]> {
    return this.http.get<CompteBancaire[]>(this.url+"/getcomptebancaire");
  }

  addCompteBancaire(compteBancaire:CompteBancaire){
    return this.http.post(this.url+"/addcomptebancaire",compteBancaire);
  }

  getCompteBancaireById(id:number) :Observable<CompteBancaire> {
    return this.http.get<CompteBancaire>(this.url+"/getcomptebancaire/"+id);
  }

  deleteCompteBancaire(id:number) :Observable<CompteBancaire> {
    return this.http.delete<CompteBancaire>(this.url+"/deletecomptebancaire/"+id);
  }

  updateCompteBancaire(compte: any): Observable<any> {
    return this.http.put(`${this.url}/updatecomptebancaire/${compte.idCompteBancaire}`, compte);
  }

  getUserById(id:number) :Observable<User>
  {
    return this.http.get<User>("http://localhost:8089/skillswap/user/getbyid/"+id);
  }

  getCompteByUser(userId: number): Observable<CompteBancaire> {
    return this.http.get<CompteBancaire>(`${this.url}/byuser/${userId}`);
  }
  
  getAllEtudants(): Observable<User[]> {
    return this.http.get<User[]>("http://localhost:8089/skillswap/user/etudiants");
  }
}
