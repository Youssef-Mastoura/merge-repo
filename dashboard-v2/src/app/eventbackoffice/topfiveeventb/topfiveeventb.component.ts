import { EventserviceService } from 'src/app/eventbackoffice/serviceseventback/eventservice.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackService } from '../serviceseventback/feedback.service';
import { myevent } from 'src/app/event';

@Component({
  selector: 'app-topfiveeventb',
  templateUrl: './topfiveeventb.component.html',
  styleUrls: ['./topfiveeventb.component.css']
})
export class TopfiveeventbComponent implements OnInit {

  topEvents: myevent[] = [];
  ratingMessages: { [eventId: number]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private feedbackservice: FeedbackService,
    private router: Router,
    private eventService: EventserviceService
  ) {}

  ngOnInit(): void {
    this.feedbackservice.showtop_5().subscribe(
      (events: myevent[]) => {
        this.topEvents = events;
        for (let event of this.topEvents) {
          this.getRating(event.eventId);
        }
      },
      error => {
        console.error('Error fetching top events:', error);
      }
    );
  }

  getRating(eventId: number): void {
    if (this.ratingMessages[eventId] !== undefined) return;

    this.eventService.rating(eventId).subscribe(
      response => {
        this.ratingMessages[eventId] = response;
      },
      error => {
        console.error(`Error fetching rating for event ${eventId}`, error);
      }
    );
  }
}
