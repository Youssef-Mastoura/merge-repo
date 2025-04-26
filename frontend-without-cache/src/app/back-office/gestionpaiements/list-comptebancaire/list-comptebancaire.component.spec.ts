import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComptebancaireComponent } from './list-comptebancaire.component';

describe('ListComptebancaireComponent', () => {
  let component: ListComptebancaireComponent;
  let fixture: ComponentFixture<ListComptebancaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListComptebancaireComponent]
    });
    fixture = TestBed.createComponent(ListComptebancaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
