import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotPaiementComponent } from './chatbot-paiement.component';

describe('ChatbotPaiementComponent', () => {
  let component: ChatbotPaiementComponent;
  let fixture: ComponentFixture<ChatbotPaiementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatbotPaiementComponent]
    });
    fixture = TestBed.createComponent(ChatbotPaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
