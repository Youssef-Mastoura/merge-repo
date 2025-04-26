import { TestBed } from '@angular/core/testing';

import { ComptebancaireService } from './comptebancaire.service';

describe('ComptebancaireService', () => {
  let service: ComptebancaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComptebancaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
