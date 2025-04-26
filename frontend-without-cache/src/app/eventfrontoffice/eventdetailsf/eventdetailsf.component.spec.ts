import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventdetailsfComponent } from './eventdetailsf.component';

describe('EventdetailsComponent', () => {
  let component: EventdetailsfComponent;
  let fixture: ComponentFixture<EventdetailsfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventdetailsfComponent]
    });
    fixture = TestBed.createComponent(EventdetailsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
