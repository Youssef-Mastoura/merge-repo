import { Component, HostListener, OnInit } from '@angular/core';
import { DashboardService } from "../dashboard.service";
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service'; 
import { AuthService } from 'src/app/services/auth.service'; 

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
})
export class TopBarComponent {
  constructor(
    private dashboard: DashboardService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {}

  openSidebar() {
    this.dashboard.openSidebar();
  }

  isProfileDropdownOpen = false;
  isUserDetailsModalOpen = false;
  currentUser: any;

  toggleProfileDropdown(event: Event): void {
    this.currentUser = this.authService.getCurrentUserInfo();
    console.log('User info:', this.currentUser);
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
    this.userService.logout();
    this.isProfileDropdownOpen = false;
  }
}