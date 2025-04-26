import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      this.router.navigate(['admin/login-admin']);
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      if (!decodedToken || !decodedToken.roles || !Array.isArray(decodedToken.roles)) {
        this.router.navigate(['admin/login-admin']);
        return false;
      }

      return true; // Allow access if the token is valid
    } catch (error) {
      console.error('Invalid token', error);
      this.router.navigate(['admin/login-admin']);
      return false;
    }
  }
}
