import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseFormBComponent } from './course-formB.component';

describe('CourseFormComponent', () => {
  let component: CourseFormBComponent;
  let fixture: ComponentFixture<CourseFormBComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseFormBComponent]
    });
    fixture = TestBed.createComponent(CourseFormBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
