import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventfComponent } from './eventf.component';

describe('EventComponent', () => {
  let component: EventfComponent;
  let fixture: ComponentFixture<EventfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventfComponent]
    });
    fixture = TestBed.createComponent(EventfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
