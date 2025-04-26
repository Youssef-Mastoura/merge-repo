import { registration } from '../../registration';
import { myevent } from '../../event';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { User } from 'src/app/back-office/models/user';
import { EventserviceServicef } from '../serviceseventf/eventservicef.service';

@Component({
  selector: 'app-eventf',
  templateUrl: './eventf.component.html',
  styleUrls: ['./eventf.component.css']
})
export class EventfComponent {
  Events: myevent[] = [];
  showSuccessModal: boolean = false;
  showAlreadyRegisteredModal: boolean = false;
  currentEventName: string = '';
  searchname: string = '';
  ratingMessage: string | null = null;
  participants: User[] = [];

  registration: registration = {
    isSelected: false,
    eventregis: {} as myevent,
    user: {} as any
  };

  constructor(private route: ActivatedRoute, private eventService: EventserviceServicef, private router: Router) {
    this.messages.push({
      role: 'assistant',
      content: 'Hello! How can I help you today?'
    });
  }

  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe(
      data => {
        this.Events = data;
        console.log('Fetched events:', data);
      },
      error => {
        console.error('Error fetching events', error);
      });
  }

  deleteEvent(eventId: number): void {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    
    if (confirmDelete) {
      this.eventService.deleteEvent(eventId).subscribe(
        response => {
          this.Events = this.Events.filter(event => event.eventId !== eventId);
          console.log('Event deleted successfully:', response);
        },
        error => {
          console.error('Error deleting event:', error);
        }
      );
    } else {
      console.log('Event deletion cancelled');
    }
  }

  onSearch(): myevent[] {
    if (!this.searchname) {
      return this.Events;
    }
    return this.Events.filter((myevent) =>
      myevent.eventName.toLowerCase().includes(this.searchname.toLowerCase())
    );
  }

  register(eventId: number): void {
    console.log('Register button clicked for event:', eventId);
    
    const userId = 1; 
    this.currentEventName = this.Events.find(e => e.eventId === eventId)?.eventName || 'the event';
    
    this.eventService.checkregistration(userId, eventId).subscribe({
      next: (hasGivenRegistration: boolean) => {
        if (hasGivenRegistration) {
          console.log('User already registered');
          this.showAlreadyRegisteredModal = true;
          this.showSuccessModal = false;
        } else {
          this.registration.user = { userId };
          this.registration.eventregis.eventId = eventId;
          
          this.eventService.register(this.registration, userId, eventId).subscribe({
            next: (response) => {
              console.log('Registration successful:', response);
              this.showSuccessModal = true;
              this.showAlreadyRegisteredModal = false;
            },
            error: (error) => {
              console.error('Registration error:', error);
              this.showAlreadyRegisteredModal = true;
              this.showSuccessModal = false;
            }
          });
        }
      },
      error: (error) => {
        console.error('Error checking registration:', error);
        this.showAlreadyRegisteredModal = true;
        this.showSuccessModal = false;
      }
    });
  }

  closeModal(): void {
    this.showSuccessModal = false;
    this.showAlreadyRegisteredModal = false;
  }

  rating(eventid: number) {
    return this.eventService.rating(eventid).subscribe(
      response => {
        console.log('Event rating:', response);
        this.ratingMessage = `Event rating: ${response}`;
      },
      error => {
        console.error('Error retrieving rating:', error);
        this.ratingMessage = 'An error occurred while fetching the rating.';
      }
    );
  }

  getParticipants(eventId: number): void {
    this.eventService.participants(eventId).subscribe(
      response => {
        this.participants = response;
        console.log('Participants:', response);
      },
      error => {
        console.error('Error retrieving participants:', error);
      }
    );
  }


  // Chat bot /////
  /////////////////
  messages: any[] = [];
  userInput = '';
  isLoading = false;


  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message to chat
    this.messages.push({
      role: 'user',
      content: this.userInput
    });

    this.isLoading = true;
    const userInput = this.userInput;
    this.userInput = '';

    // Call the service
    this.eventService.sendMessage(this.messages).subscribe({
      next: (response: any) => {
        const assistantReply = response.choices[0].message.content;
        this.messages.push({
          role: 'assistant',
          content: assistantReply
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        });
        this.isLoading = false;
      }
    });
  }

  // In your component class
activeIndex: number | null = null;

toggleAccordion(index: number): void {
  this.activeIndex = this.activeIndex === index ? null : index;
}

  // Add these methods to your EventfComponent class

// Check if event hasn't started yet
isEventNotStarted(event: myevent): boolean {
  const currentDate = new Date();
  return new Date(event.eventStartDate) > currentDate;
}

// Check if registration period has passed
isRegistrationClosed(event: myevent): boolean {
  const currentDate = new Date();
  return new Date(event.registrationEndDate) < currentDate;
}

// Check if feedback period is over (event end date + 7 days)
isFeedbackPeriodOver(event: myevent): boolean {
  const currentDate = new Date();
  const feedbackEndDate = new Date(event.eventEndDate);
  feedbackEndDate.setDate(feedbackEndDate.getDate() + 7);
  return currentDate > feedbackEndDate;
}

// Check if event is currently ongoing
isEventOngoing(event: myevent): boolean {
  const currentDate = new Date();
  return new Date(event.eventStartDate) <= currentDate && 
         new Date(event.eventEndDate) >= currentDate;
}
}