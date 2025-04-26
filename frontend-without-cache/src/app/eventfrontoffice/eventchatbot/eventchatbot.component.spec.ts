import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventchatbotComponent } from './eventchatbot.component';

describe('EventchatbotComponent', () => {
  let component: EventchatbotComponent;
  let fixture: ComponentFixture<EventchatbotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventchatbotComponent]
    });
    fixture = TestBed.createComponent(EventchatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
