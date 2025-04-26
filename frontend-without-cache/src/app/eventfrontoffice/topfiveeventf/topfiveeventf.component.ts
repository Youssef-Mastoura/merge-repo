import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { myevent } from '../../event';
import { EventserviceServicef } from '../serviceseventf/eventservicef.service';
import { FeedbackeventfService } from '../serviceseventf/feedbackeventf.service';

@Component({
  selector: 'app-topfiveeventf',
  templateUrl: './topfiveeventf.component.html',
  styleUrls: ['./topfiveeventf.component.css']
})
export class TopfiveeventfComponent implements OnInit {

  topEvents: myevent[] = [];
  ratingMessages: { [eventId: number]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private feedbackservice: FeedbackeventfService,
    private router: Router,
    private eventService: EventserviceServicef
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
  activeIndex: number | null = null;

toggleAccordion(index: number): void {
  this.activeIndex = this.activeIndex === index ? null : index;
}
}
