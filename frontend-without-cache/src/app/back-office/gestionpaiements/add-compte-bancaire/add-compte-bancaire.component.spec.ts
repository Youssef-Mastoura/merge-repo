import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompteBancaireComponent } from './add-compte-bancaire.component';

describe('AddCompteBancaireComponent', () => {
  let component: AddCompteBancaireComponent;
  let fixture: ComponentFixture<AddCompteBancaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCompteBancaireComponent]
    });
    fixture = TestBed.createComponent(AddCompteBancaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
