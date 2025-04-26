import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouseListEtudiantComponent } from './couse-list-etudiant.component';

describe('CouseListEtudiantComponent', () => {
  let component: CouseListEtudiantComponent;
  let fixture: ComponentFixture<CouseListEtudiantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CouseListEtudiantComponent]
    });
    fixture = TestBed.createComponent(CouseListEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
