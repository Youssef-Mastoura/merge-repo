import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendrierReservationComponent } from './calendrier-reservation.component';

describe('CalendrierReservationComponent', () => {
  let component: CalendrierReservationComponent;
  let fixture: ComponentFixture<CalendrierReservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendrierReservationComponent]
    });
    fixture = TestBed.createComponent(CalendrierReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
