import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; 
import { UserService } from 'src/app/services/user.service'; 

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  isAuthenticated: boolean = false; // Variable simple (pas d'Observable)
  userInfo: any;
  constructor(private router: Router,  private authService
    : AuthService,private userService: UserService,

  ) { localStorage.clear();
 
      this.isAuthenticated = this.authService.isAuthenticatedSync();
}

}
