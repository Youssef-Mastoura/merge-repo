import { EventserviceService } from 'src/app/eventbackoffice/serviceseventback/eventservice.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { registration } from '../../registration';
import { User } from 'src/app/back-office/models/user';

@Component({
  selector: 'app-eventregistrations',
  templateUrl: './eventregistrations.component.html',
  styleUrls: ['./eventregistrations.component.css']
})
export class EventregistrationsComponent {
  registrations: registration[] = [];
  registrationUsers: { [key: number]: User } = {}; 

  constructor(
    private route: ActivatedRoute,
    private eventservice: EventserviceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    console.log("Event ID:", eventId); // Debug log

    this.eventservice.getregistrationsevent(eventId).subscribe(
      data => {
        console.log("Registrations fetched:", data); // Debug log
        this.registrations = data;

        this.registrations.forEach(fb => {
          const regId = fb.registrationId || (fb as any).RegistrationId;
          if (regId) {
            this.eventservice.getregistrationuser(regId).subscribe(
              user => {
                this.registrationUsers[regId] = user;
              },
              error => console.error('Error fetching user for registration:', error)
            );
          }
        });
      },
      error => console.error('Error fetching registrations:', error)
    );
  }

  deleteregistration(registrationId: number) {
    const confirmDelete = window.confirm('Are you sure you want to delete this registration?');
    if (confirmDelete) {
      this.eventservice.deleteregistraion(registrationId).subscribe(() => {
        this.registrations = this.registrations.filter(fb => fb.registrationId !== registrationId);
        delete this.registrationUsers[registrationId];
      });
    } else {
      console.log('Registration deletion cancelled');
    }
  }
}
