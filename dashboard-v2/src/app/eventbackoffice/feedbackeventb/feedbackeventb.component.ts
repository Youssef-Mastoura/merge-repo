
import { Component } from '@angular/core';
import { EventserviceService } from 'src/app/eventbackoffice/serviceseventback/eventservice.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FeedbackService } from 'src/app/eventbackoffice/serviceseventback/feedback.service';
import { myevent } from 'src/app/event';
import { feedback } from 'src/app/feedback';

@Component({
  selector: 'app-feedbackeventb',
  templateUrl: './feedbackeventb.component.html',
  styleUrls: ['./feedbackeventb.component.css']
})
export class FeedbackeventbComponent {
  eventId!: number;
  feedbackevent?: myevent;
  feedback: feedback = {
    comment: '',
    eventRating: 0,
    event: undefined,
  };

  constructor(private route: ActivatedRoute, private router: Router , private eventService: EventserviceService, private feedbackService: FeedbackService
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
      this.router.navigate(['/event']);

    });
  }
  
}
