import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventserviceServicef } from '../serviceseventf/eventservicef.service';

@Component({
  selector: 'app-eventchatbot',
  templateUrl: './eventchatbot.component.html',
  styleUrls: ['./eventchatbot.component.css']
})
export class EventchatbotComponent {

  messages: any[] = [];
  userInput = '';
  isLoading = false;


   constructor(private route: ActivatedRoute, private eventService: EventserviceServicef, private router: Router) {
      this.messages.push({
        role: 'assistant',
        content: 'Hello! How can I help you today?'
      });
    }

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message to chat
    this.messages.push({
      role: 'user',
      content: this.userInput
    });

    this.isLoading = true;
    const userInput = this.userInput;
    this.userInput = '';

    // Call the service
    this.eventService.sendMessage(this.messages).subscribe({
      next: (response: any) => {
        const assistantReply = response.choices[0].message.content;
        this.messages.push({
          role: 'assistant',
          content: assistantReply
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        });
        this.isLoading = false;
      }
    });
  }
  activeIndex: number | null = null;

  toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
