import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventserviceService } from '../serviceseventback/eventservice.service';
import { User } from 'src/app/back-office/models/user';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private eventService: EventserviceService,
    private router: Router
  ) {}
  
  participants: User[] = [];
  eventId: number = 0;
  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('event', this.eventId);
    this.eventService.participants(this.eventId).subscribe(
      response => {
        this.participants = response;
        console.log('Participants:', response);
      },
      error => {
        console.error('Error retrieving participants:', error);
      }
    );
  }

  mailusers: User[] = [];

  sendMails(): void {

    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.participants(eventId).subscribe({
      next: (participants) => {
        this.mailusers = participants;
        console.log('Participants:', participants);
        
        if (participants.length === 0) {
          console.log('No participants to email');
          return;
        }
        alert('Sending mails ! !');

              participants.forEach(user => {
          this.eventService.mailing(user.id_User! , eventId).subscribe({
            next: () => { 
              console.log(`Email sent successfully to user ${user.id_User}`);
            },
            error: (err) => {
              console.error(`Failed to send email to user ${user.id_User}:`, err);
            }
          });
        });
      },
      error: (err) => {
        console.error('Error retrieving participants:', err);
      }
    });
  }

}