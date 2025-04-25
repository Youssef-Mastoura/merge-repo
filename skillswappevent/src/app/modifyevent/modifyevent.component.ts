import { Component } from '@angular/core';
import { EventserviceService } from 'src/app/services/eventservice.service';
import { myevent } from '../event';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-modifyevent',
  templateUrl: './modifyevent.component.html',
  styleUrls: ['./modifyevent.component.css']
})
export class ModifyeventComponent {
  eventId!: number;
  event: myevent = {} as myevent;

  constructor( private route: ActivatedRoute, private eventService: EventserviceService, private router: Router) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEvent(this.eventId).subscribe(data => {
      this.event = data;
    });
  }

  onSubmit(): void {
    this.eventService.updateEvent(this.eventId, this.event).subscribe(() => {
      alert('Event updated successfully!');
      this.router.navigate(['/']);
    });
  }
}
