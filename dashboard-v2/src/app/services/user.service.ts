import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, tap, throwError } from 'rxjs';
import { User } from '../back-office/models/user'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { SocialUser } from '@abacritt/angularx-social-login';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiServerUrl ="http://localhost:8089/skillswap";

  constructor(private http: HttpClient,private authService:AuthService,private router:Router){}
  public registerWithGoogle(user: SocialUser): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/user/oauth2/google`, {
      provider: 'google',
      providerId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
      idToken: user.idToken
    });
  }
  
  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/user/login`, credentials).pipe(
      catchError(error => {
        // Transforme l'erreur en un format plus lisible
        if (error.status === 401) {
          throw new Error('Email ou mot de passe incorrect');
        }
        throw new Error('Erreur de connexion au serveur');
      })
    );
  }
 
  logout(): Observable<void> {
    // Convertit la Promise en Observable
    return from(this.authService.logout()).pipe(
      tap(() => {
        this.authService.clearAuth();
        this.router.navigate(['/admin/login-admin']);
      }),
      catchError(error => {
        console.error('Logout error:', error);
        this.authService.clearAuth();
        this.router.navigate(['/admin/login-admin']);
        return throwError(() => error);
      })
    );
  }

  public getUsers(): Observable<User[]> {
    const headers =new HttpHeaders({
      'Content-Type': 'application/json',
     // 'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<User[]>(`${this.apiServerUrl}/user/getall`,{headers});
  }

  public addUser(user: User): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    //  'Authorization': 'Bearer your-token' 
    });
    return this.http.post<User>(`${this.apiServerUrl}/user/register`, user)
  }

  public updateuser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiServerUrl}update`, user);
  }

  public deleteUser(userId: number): Observable<void> {
    
    return this.http.delete<void>(`${this.apiServerUrl}/user/delete/${userId}`);
  }

  exportUsersToExcel(): void {
    window.open(`${this.apiServerUrl}/user/export/excel`, '_blank');
  }

  // Dans user.service.ts
public resetPassword(email: string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.post(`${this.apiServerUrl}/user/resetpassword/${email}`, null, { headers }).pipe(
    catchError(error => {
      if (error.status === 404) {
        throw new Error('Utilisateur introuvable');
      }
      throw new Error(error.error?.message || 'Erreur lors de la demande de réinitialisation');
    })
  );
}

// Ajoutez cette méthode dans user.service.ts
public changePassword(code: string, newPassword: string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  
  return this.http.post(
    `${this.apiServerUrl}/user/changepassword/${code}/${newPassword}`, 
    null, 
    { headers }
  ).pipe(
    catchError(error => {
      if (error.status === 400) {
        throw new Error('Code invalide ou expiré');
      }
      throw new Error('Erreur lors du changement de mot de passe');
    })
  );
}


public getUserById(id: number): Observable<User> {
  return this.http.get<User>(`${this.apiServerUrl}/user/getbyid/${id}`).pipe(
    catchError(error => {
      if (error.status === 404) {
        throw new Error('Utilisateur non trouvé');
      }
      throw new Error('Erreur serveur lors de la récupération');
    }),
    map(user => {
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      return user;
    })
  );
}

public getUserByEmail(email: string): Observable<User> {
  return this.http.get<User>(`${this.apiServerUrl}/user/getbyemail/${email}`).pipe(
    catchError(error => {
      if (error.status === 404) {
        throw new Error('Aucun utilisateur avec cet email');
      }
      throw new Error('Erreur serveur lors de la recherche');
    }),
    map(user => {
      if (!user) {
        throw new Error('Aucun utilisateur trouvé');
      }
      return user;
    })
  );
}

}
