import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventregistrationsComponent } from './eventregistrations.component';

describe('EventregistrationsComponent', () => {
  let component: EventregistrationsComponent;
  let fixture: ComponentFixture<EventregistrationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventregistrationsComponent]
    });
    fixture = TestBed.createComponent(EventregistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
