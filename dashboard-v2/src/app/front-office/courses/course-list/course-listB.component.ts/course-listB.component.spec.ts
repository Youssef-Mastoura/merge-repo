import { CourseListBComponent } from "./course-listB.component";
import { ComponentFixture, TestBed } from '@angular/core/testing';


describe('CourseListComponent', () => {
  let component: CourseListBComponent;
  let fixture: ComponentFixture<CourseListBComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseListBComponent]
    });
    fixture = TestBed.createComponent(CourseListBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
