import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseContentBComponent } from './course-contentB.component';

describe('CourseContentComponent', () => {
  let component: CourseContentBComponent;
  let fixture: ComponentFixture<CourseContentBComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseContentBComponent]
    });
    fixture = TestBed.createComponent(CourseContentBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
