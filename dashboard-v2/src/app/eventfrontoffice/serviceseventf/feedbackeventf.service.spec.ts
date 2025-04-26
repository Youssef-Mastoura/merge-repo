import { TestBed } from '@angular/core/testing';

import { FeedbackeventfService } from './feedbackeventf.service';

describe('FeedbackService', () => {
  let service: FeedbackeventfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackeventfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
