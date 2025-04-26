import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackeventfComponent } from './feedbackeventf.component';

describe('FeedbackComponent', () => {
  let component: FeedbackeventfComponent;
  let fixture: ComponentFixture<FeedbackeventfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackeventfComponent]
    });
    fixture = TestBed.createComponent(FeedbackeventfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
