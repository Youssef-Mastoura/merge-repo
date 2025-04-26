import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaiementService } from 'src/app/services/paiement.service';

@Component({
  selector: 'app-chatbot-paiement',
  templateUrl: './chatbot-paiement.component.html',
  styleUrls: ['./chatbot-paiement.component.css']
})
export class ChatbotPaiementComponent {
  messageForm!: FormGroup;
  response = '';
  currentTime = new Date();
  isLoading = false;
  messages: {text: string, sender: 'user' | 'bot', time: Date}[] = [];

  constructor(private paiementService: PaiementService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      message: ['']
    });

    setTimeout(() => {
      this.addBotMessage("Bonjour ! Comment puis-je vous aider aujourd'hui ?");
    }, 800);
  }

  addBotMessage(text: string) {
    this.messages.push({
      text,
      sender: 'bot',
      time: new Date()
    });
    this.speak(text); // Call speak when a new bot message is added
  }

  addUserMessage(text: string) {
    this.messages.push({
      text,
      sender: 'user',
      time: new Date()
    });
  }

  sendMessage(): void {
    const message = this.messageForm.get('message')?.value;
    if (!message) return;

    this.addUserMessage(message);
    this.isLoading = true;
    this.currentTime = new Date();
    this.messageForm.reset();
    
    this.paiementService.sendMessageToChatbot(message).subscribe({
      next: (data) => {
        this.addBotMessage(data.response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.addBotMessage("Désolé, je rencontre un problème technique. Veuillez réessayer plus tard.");
        this.isLoading = false;
      }
    });
  }

  startVoiceRecognition(): void {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.addUserMessage(transcript);
        this.messageForm.get('message')?.setValue(transcript);
        this.sendMessage();
      };

      recognition.onerror = (event: any) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        this.addBotMessage("Désolé, je n'ai pas pu comprendre.");
      };

      recognition.start();
    } else {
      alert("Votre navigateur ne prend pas en charge la reconnaissance vocale.");
    }
  }

  speak(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR'; // Set language to French
    speechSynthesis.speak(utterance);
  }

}
