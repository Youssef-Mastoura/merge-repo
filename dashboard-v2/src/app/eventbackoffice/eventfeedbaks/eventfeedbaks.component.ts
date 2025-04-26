import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventserviceService } from '../serviceseventback/eventservice.service';
import { FeedbackService } from '../serviceseventback/feedback.service';
import { feedback } from '../../feedback';
import { User } from 'src/app/back-office/models/user';

@Component({
  selector: 'app-eventfeedbaks',
  templateUrl: './eventfeedbaks.component.html',
  styleUrls: ['./eventfeedbaks.component.css']
})
export class EventfeedbaksComponent {
  feedbacks: feedback[] = [];
  feedbackUsers: { [key: number]: User } = {}; 

  constructor(
    private route: ActivatedRoute,
    private feedbackservice: FeedbackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));

    this.feedbackservice.getfeedbacksevent(eventId).subscribe(
      data => {
        this.feedbacks = data;
        this.feedbacks.forEach(fb => {
          if (fb.feedbackId) {
            this.feedbackservice.getfeedbackuser(fb.feedbackId).subscribe(
              user => {
                this.feedbackUsers[fb.feedbackId!] = user;
              },
              error => console.error('Error fetching user for feedback:', error)
            );
          }
        });
      },
      error => console.error('Error fetching feedbacks', error)
    );
  }
}
