import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomefComponent } from './homef.component';

describe('HomeComponent', () => {
  let component: HomefComponent;
  let fixture: ComponentFixture<HomefComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomefComponent]
    });
    fixture = TestBed.createComponent(HomefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
