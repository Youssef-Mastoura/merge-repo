import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  
  
  
})
export class AppComponent {
  title = 'my-app';
  currentLayout: string = 'default';
  
  constructor(private authService: AuthService, private router: Router) {
    this.router.events
    .pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd) // 👈 le type guard ici
    )
    .subscribe((event) => {
      const url = event.urlAfterRedirects;

      if (url.startsWith('/admin')) {
        this.currentLayout = 'admin';
      } else if (url.startsWith('/student')
       ) {
        this.currentLayout = 'student';
        
      } else if (url.startsWith('/professor') ) {
        this.currentLayout = 'professor';}
       else {
        this.currentLayout = 'default';
      }
    });
}
  }

  




  

