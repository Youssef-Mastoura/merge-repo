import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; 
import { UserService } from 'src/app/services/user.service'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAuthenticated: boolean = false; // Variable simple (pas d'Observable)
  userInfo: any;
  constructor(private router: Router,  private authService: AuthService,private userService: UserService,

  ) { 
 
      this.isAuthenticated = this.authService.isAuthenticatedSync();
}


isProfileDropdownOpen = false;
isUserDetailsModalOpen = false;
currentUser: any;

toggleProfileDropdown(event: Event): void {
  this.currentUser = this.authService.getCurrentUserInfo();
  console.log('User info frontttt:', this.currentUser);
  event.stopPropagation();
  this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
}

openUserDetailsModal(): void {
  this.currentUser = this.authService.getCurrentUserInfo();
  this.isUserDetailsModalOpen = true;
  this.isProfileDropdownOpen = false;
}

closeUserDetailsModal(): void {
  this.isUserDetailsModalOpen = false;
}

@HostListener('document:click', ['$event'])
closeProfileDropdown(event: Event): void {
  if (!(event.target as HTMLElement).closest('#user-menu-button') && 
      !(event.target as HTMLElement).closest('#profile-dropdown')) {
    this.isProfileDropdownOpen = false;
  }
}

logout(): void {
  this.authService.logout();
  this.isProfileDropdownOpen = false;
}

}
