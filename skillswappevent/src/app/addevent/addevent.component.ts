import { Component } from '@angular/core';
import { EventserviceService } from 'src/app/services/eventservice.service';
import { myevent } from '../event';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.component.html',
  styleUrls: ['./addevent.component.css']
})
export class AddeventComponent {
  event: myevent = {
    eventId: 0, // eventId will be set by the backend upon creation
    eventName: '',
    eventDescription: '',
    eventType: '',
    posterURL: '',
    eventStartDate: new Date(),
    eventEndDate: new Date(),
    maxParticipants: 0,
    registrationEndDate: new Date(),
    location: ''
  };

  constructor(private eventService: EventserviceService, private router: Router) {}

  onSubmit(): void {
    this.eventService.createEvent(this.event).subscribe(
      response => {
        console.log('Event created successfully:', response);
        this.router.navigate(['/']); // Redirect to the events list page after success
      },
      error => {
        console.error('Error creating event:', error);
      }
    );
  }
}
