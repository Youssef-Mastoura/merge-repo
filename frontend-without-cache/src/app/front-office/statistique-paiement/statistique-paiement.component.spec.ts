import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiquePaiementComponent } from './statistique-paiement.component';

describe('StatistiquePaiementComponent', () => {
  let component: StatistiquePaiementComponent;
  let fixture: ComponentFixture<StatistiquePaiementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatistiquePaiementComponent]
    });
    fixture = TestBed.createComponent(StatistiquePaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
