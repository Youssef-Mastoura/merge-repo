import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; 

@Component({
  selector: 'app-home',
  templateUrl: './homef.component.html',
  styleUrls: ['../../../style2.css']
})
export class HomefComponent  implements OnInit{

  isAuthenticated: boolean = false; // Variable simple (pas d'Observable)
  userInfo: any;

  constructor(private router: Router,   private authService: AuthService
  ) {    this.isAuthenticated = this.authService.isAuthenticatedSync();


    console.log('État auth initial front***********:', this.isAuthenticated);


    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.userInfo = this.authService.getCurrentUserInfo();
        console.log('User info ok:', this.userInfo);
        this.isAuthenticated = this.authService.isAuthenticatedSync();
        console.log('État auth après navigation: 1', this.isAuthenticated);
      
      }
    });
  }
ngOnInit(): void {
  this.userInfo = this.authService.getCurrentUserInfo();
  console.log('User info fronttt :', this.userInfo);
  console.log('État auth après navigation: fronttt', this.isAuthenticated);

}
}
