import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventfeedbaksComponent } from './eventfeedbaks.component';

describe('EventfeedbaksComponent', () => {
  let component: EventfeedbaksComponent;
  let fixture: ComponentFixture<EventfeedbaksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventfeedbaksComponent]
    });
    fixture = TestBed.createComponent(EventfeedbaksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
