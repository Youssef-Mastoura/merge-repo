import { SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' }) // Disponible dans toute l'app
export class AuthService {
  // État d'authentification (false par défaut)
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  // Observable que les composants peuvent écouter
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  
  private apiServerUrl ="http://localhost:8089/skillswap";


  constructor(private http: HttpClient,
    private socialAuthService: SocialAuthService,
    private router: Router) {
    this.checkAuthOnInit(); // Vérifie l'authentification au démarrage
  }
  async logout(): Promise<void> {
    try {
      // 1. Déconnexion Google (si utilisateur connecté via Google)
      await this.socialAuthService.signOut();
      
      // 2. Appel au backend pour invalider la session
      await this.http.post(`${this.apiServerUrl}/user/logout`, {}).toPromise();
      
      // 3. Nettoyage local
      localStorage.removeItem('auth_token');
      this.isAuthenticatedSubject.next(false);
      
      // 4. Redirection + rechargement
      await this.router.navigate(['/admin/login-admin']);
      window.location.reload();
      
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Fallback en cas d'échec
      localStorage.removeItem('auth_token');
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/admin/login-admin']);
    }
  }

  // Vérifie si un token existe
  private checkAuthOnInit(): void {
    const token = localStorage.getItem('auth_token');
    this.isAuthenticatedSubject.next(!!token); // !! convertit en booléen
  }

  // Login réussi → stocke le token et notifie les composants
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.isAuthenticatedSubject.next(true);
    console.log("token seted",token)
  }

  // Logout → supprime le token et notifie
  clearAuth(): void {
    localStorage.removeItem('auth_token');
    this.isAuthenticatedSubject.next(false);
  }

  // Vérification synchrone (pour les guards)
  isAuthenticatedSync(): boolean {
    return !!localStorage.getItem('auth_token');
  }
  
  isAdminUser(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'ADMIN'; // Adaptez 'role' et 'ADMIN' selon votre structure JWT
    } catch (e) {
      console.error('Error decoding token', e);
      return false;
    }
  }

  getUserInfoFromToken(token: string): { id: number, email: string, role: string } | null {
    try {
      if (!token) return null;
      
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      
      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  // Optionnel: Méthode pratique pour récupérer les infos du token stocké
  getCurrentUserInfo() {
    const token = localStorage.getItem('auth_token');
    return token ? this.getUserInfoFromToken(token) : null;
  }

  getUserRoleFromToken(token: string): string {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role; // 'ADMIN', 'ETUDIANT', 'PROFESSOR'
  }
}