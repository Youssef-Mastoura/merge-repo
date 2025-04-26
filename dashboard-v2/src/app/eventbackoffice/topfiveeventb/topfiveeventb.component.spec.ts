import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopfiveeventbComponent } from './topfiveeventb.component';

describe('TopfiveComponent', () => {
  let component: TopfiveeventbComponent;
  let fixture: ComponentFixture<TopfiveeventbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopfiveeventbComponent]
    });
    fixture = TestBed.createComponent(TopfiveeventbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
