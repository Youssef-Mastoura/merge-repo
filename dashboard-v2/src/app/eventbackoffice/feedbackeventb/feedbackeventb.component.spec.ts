import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackeventbComponent } from './feedbackeventb.component';

describe('FeedbackComponent', () => {
  let component: FeedbackeventbComponent;
  let fixture: ComponentFixture<FeedbackeventbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackeventbComponent]
    });
    fixture = TestBed.createComponent(FeedbackeventbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
