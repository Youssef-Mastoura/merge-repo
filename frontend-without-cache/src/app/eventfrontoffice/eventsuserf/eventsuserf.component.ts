import { Component } from '@angular/core';
import { myevent } from '../../event';
import { ActivatedRoute, Router } from '@angular/router';
import { EventserviceServicef } from '../serviceseventf/eventservicef.service';

@Component({
  selector: 'app-eventsuserf',
  templateUrl: './eventsuserf.component.html',
  styleUrls: ['./eventsuserf.component.css']
})
export class EventsuserfComponent {

    Events: myevent[] = [];
  
    constructor(private route: ActivatedRoute, private eventService: EventserviceServicef, private router: Router ) {}

    ngOnInit(): void {
      const userId = 115;
      this.eventService.registrations_user(userId).subscribe(
        data => {
          this.Events = data;
          console.log('Fetched events:', data); 
  
        },
        error => {
          console.error('Error fetching events', error);
        });}


        searchname:string = '';        
      onSearch(): myevent[] {
        if (!this.searchname) {
          return this.Events;
        }
        return this.Events.filter((myevent) =>
          myevent.eventName.toLowerCase().includes(this.searchname.toLowerCase())
      );
      }

      activeIndex: number | null = null;

      toggleAccordion(index: number): void {
        this.activeIndex = this.activeIndex === index ? null : index;
      }

}
