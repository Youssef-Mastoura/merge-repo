import { feedback } from './../feedback';
import { myevent } from './../event';
import { Component } from '@angular/core';
import { EventserviceService } from 'src/app/services/eventservice.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  eventId!: number;
  feedbackevent?: myevent;
  feedback: feedback = {
    comment: '',
    eventRating: 0,
    event: undefined,
  };

  constructor(private route: ActivatedRoute, private eventService: EventserviceService, private feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEvent(this.eventId).subscribe((event) => {
      this.feedbackevent = event;
      this.feedback.event = event;
    });
  }

  submitFeedback(): void {
    console.log('Feedback submitted:', this.feedback);
    const userId = 1

    this.feedbackService.addEventFeedback(userId , this.eventId,this.feedback).subscribe(() => {
      alert('Feedback submitted!');
    });
  }
}
