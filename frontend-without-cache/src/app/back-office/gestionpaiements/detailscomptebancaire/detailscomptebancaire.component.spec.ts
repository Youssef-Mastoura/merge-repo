import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailscomptebancaireComponent } from './detailscomptebancaire.component';

describe('DetailscomptebancaireComponent', () => {
  let component: DetailscomptebancaireComponent;
  let fixture: ComponentFixture<DetailscomptebancaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailscomptebancaireComponent]
    });
    fixture = TestBed.createComponent(DetailscomptebancaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
