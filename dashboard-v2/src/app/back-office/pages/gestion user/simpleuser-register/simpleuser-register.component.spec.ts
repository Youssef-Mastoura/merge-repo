import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleuserRegisterComponent } from './simpleuser-register.component';

describe('SimpleuserRegisterComponent', () => {
  let component: SimpleuserRegisterComponent;
  let fixture: ComponentFixture<SimpleuserRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimpleuserRegisterComponent]
    });
    fixture = TestBed.createComponent(SimpleuserRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
