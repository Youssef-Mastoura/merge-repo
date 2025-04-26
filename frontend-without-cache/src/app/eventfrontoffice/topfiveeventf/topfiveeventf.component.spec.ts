import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopfiveeventfComponent } from './topfiveeventf.component';

describe('TopfiveComponent', () => {
  let component: TopfiveeventfComponent;
  let fixture: ComponentFixture<TopfiveeventfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopfiveeventfComponent]
    });
    fixture = TestBed.createComponent(TopfiveeventfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
