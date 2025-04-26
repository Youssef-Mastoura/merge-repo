import { feedback } from '../../feedback';
import { myevent } from '../../event';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EventserviceServicef } from '../serviceseventf/eventservicef.service';
import { FeedbackeventfService } from '../serviceseventf/feedbackeventf.service';

@Component({
  selector: 'app-feedbackeventf',
  templateUrl: './feedbackeventf.component.html',
  styleUrls: ['./feedbackeventf.component.css'],
  
})
export class FeedbackeventfComponent {
  eventId!: number;
  feedbackevent?: myevent;
  showSuccessModal: boolean = false; // Added modal control property
  UserId = 1; // Moved up for better organization

  feedback: feedback = {
    comment: '',
    eventRating: 0,
    event: undefined,
  };
  
  showErrorModal: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private eventService: EventserviceServicef, 
    private feedbackService: FeedbackeventfService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEvent(this.eventId).subscribe((event) => {
      this.feedbackevent = event;
      this.feedback.event = event;
    });
  }

  submitFeedback(): void {
    if (this.feedback.eventRating <= 0) {
      this.errorMessage = 'Please provide a rating';
      this.showErrorModal = true;
      return;
    }
  
    this.feedbackService.checkfeedback(this.UserId, this.eventId).subscribe({
      next: (hasGivenFeedback: boolean) => {
        if (hasGivenFeedback) {
          this.errorMessage = 'You have already made feedback for this event!';
          this.showErrorModal = true;
        } else {
          this.feedbackService.addEventFeedback(this.UserId, this.eventId, this.feedback).subscribe({
            next: () => {
              this.showSuccessModal = true;
            },
            error: (err) => {
              this.errorMessage = 'An error occurred while submitting feedback';
              this.showErrorModal = true;
              console.log(this.feedback);
              console.error('Error:', err);
            }
          });
        }
      },
      error: (err) => {
        this.errorMessage = 'Error checking feedback status';
        this.showErrorModal = true;
        console.error('Error:', err);
      }
    });
  }
  
  // Add this new method to close error modal
  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  // Added closeModal method
  closeModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/eventf']); // Navigate after closing modal
  }
  activeIndex: number | null = null;

toggleAccordion(index: number): void {
  this.activeIndex = this.activeIndex === index ? null : index;
}
}