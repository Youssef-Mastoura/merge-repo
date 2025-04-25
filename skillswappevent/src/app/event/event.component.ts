import { registration } from './../registration';
import { myevent } from './../event';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { EventserviceService } from 'src/app/services/eventservice.service';
import { registerLocaleData } from '@angular/common';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {

  Events: myevent[] = [];

  constructor(private route: ActivatedRoute, private eventService: EventserviceService, private router: Router ) {}

 
  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe(
      data => {
        this.Events = data;
        console.log('Fetched events:', data); 

      },
      error => {
        console.error('Error fetching events', error);
      });}

      deleteEvent(eventId: number): void {
        this.eventService.deleteEvent(eventId).subscribe(
          response => {
            this.Events = this.Events.filter(event => event.eventId !== eventId);
            console.log('Event deleted successfully:', response);
          },
          error => {
            console.error('Error deleting event:', error);
          }
        );
      }
      searchname:string = '';

      onSearch(): myevent[] {
        if (!this.searchname) {
          return this.Events;
        }
        return this.Events.filter((myevent) =>
          myevent.eventName.toLowerCase().includes(this.searchname.toLowerCase())
      );
      }
      registration: registration = {
        isSelected: false,
        eventregis: {} as myevent,
        user: {} as any
      };
      register(eventId: number): void {
        const userId = 1; 
        this.registration.user = { userId };
        this.registration.eventregis.eventId = Number(this.route.snapshot.paramMap.get('id'));

        this.eventService.register(this.registration,userId,eventId).subscribe(
          response => {
            console.log('User registered successfully:', response);
            alert('You have successfully registered for the event!');
          },
          error => {
            console.error('Error registering user:', error);
            alert('An error occurred during registration.');
          }
        );
      }
      
}