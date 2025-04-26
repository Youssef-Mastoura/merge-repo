import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { AuthService } from 'src/app/services/auth.service'; 

@Component({
  selector: 'dashboard-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  isAuthenticated: boolean = false; // Variable simple (pas d'Observable)
  userInfo: any;

  constructor(private router: Router, private dashboard: DashboardService,   private authService: AuthService
  ) {    this.isAuthenticated = this.authService.isAuthenticatedSync();
    console.log('État auth initial:', this.isAuthenticated);


    this.router.events.subscribe((event: Event) => {
      this.dashboard.setCurrentRoute(this.router.url);
      if (event instanceof NavigationEnd) {
        this.userInfo = this.authService.getCurrentUserInfo();
        console.log('User info:', this.userInfo);
        this.isAuthenticated = this.authService.isAuthenticatedSync();
        console.log('État auth après navigation: 1', this.isAuthenticated);
        if (this.dashboard.sidebarOpen && window.innerWidth < 1024) {
          this.dashboard.closeSidebar();
        }
      }
    });
  }

  ngOnInit() {
    
    // set the html tag attribute overflow to hidden when component is mounted
    document.documentElement.style.overflow = 'hidden';
    console.log('État auth dans ngOnInit:', this.isAuthenticated);
   

  }
}
