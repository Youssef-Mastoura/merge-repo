import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatecomptebancaireComponent } from './updatecomptebancaire.component';

describe('UpdatecomptebancaireComponent', () => {
  let component: UpdatecomptebancaireComponent;
  let fixture: ComponentFixture<UpdatecomptebancaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatecomptebancaireComponent]
    });
    fixture = TestBed.createComponent(UpdatecomptebancaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
