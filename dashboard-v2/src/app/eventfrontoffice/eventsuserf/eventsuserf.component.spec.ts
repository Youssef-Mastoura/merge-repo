import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsuserfComponent } from './eventsuserf.component';

describe('EventsuserComponent', () => {
  let component: EventsuserfComponent;
  let fixture: ComponentFixture<EventsuserfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventsuserfComponent]
    });
    fixture = TestBed.createComponent(EventsuserfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
