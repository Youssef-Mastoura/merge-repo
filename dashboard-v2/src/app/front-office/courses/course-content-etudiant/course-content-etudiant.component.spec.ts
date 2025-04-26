import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseContentEtudiantComponent } from './course-content-etudiant.component';

describe('CourseContentEtudiantComponent', () => {
  let component: CourseContentEtudiantComponent;
  let fixture: ComponentFixture<CourseContentEtudiantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseContentEtudiantComponent]
    });
    fixture = TestBed.createComponent(CourseContentEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
