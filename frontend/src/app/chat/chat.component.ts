import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';

interface Message {
  text: string;
  isUser: boolean;
  isError?: boolean;
  isTyping?: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50">
      <button
        *ngIf="!isOpen"
        (click)="toggleChat()"
        class="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </button>

      <div
        *ngIf="isOpen"
        class="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden"
        style="height: 480px;"
      >
        <div class="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            <span class="font-medium text-sm">Asistente</span>
          </div>
          <button (click)="toggleChat()" class="text-white hover:text-gray-200">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-3" #chatContainer>
          <div *ngFor="let msg of messages">
            <div *ngIf="msg.isUser" class="flex justify-end">
              <div class="bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-xs text-sm">
                {{ msg.text }}
              </div>
            </div>
            <div *ngIf="!msg.isUser" class="flex justify-start">
              <div
                class="rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs text-sm"
                [ngClass]="msg.isError ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'"
              >
                <p *ngIf="!msg.isTyping" class="font-medium text-xs text-gray-500 mb-1">Asistente</p>
                <p *ngIf="msg.isTyping" class="flex items-center gap-1">
                  Asistente pensando
                  <span class="animate-bounce">.</span>
                  <span class="animate-bounce" style="animation-delay: 0.2s">.</span>
                  <span class="animate-bounce" style="animation-delay: 0.4s">.</span>
                </p>
                <p *ngIf="!msg.isTyping" [innerHTML]="msg.text"></p>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 p-3 flex gap-2">
          <input
            #chatInput
            type="text"
            [(ngModel)]="inputMessage"
            (keydown.enter)="sendMessage(); $event.preventDefault()"
            placeholder="Pregunta sobre tus gastos..."
            class="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            (click)="sendMessage()"
            [disabled]="!inputMessage.trim() || isThinking"
            class="bg-blue-600 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-bounce { display: inline-block; }
  `]
})
export class ChatComponent {
  isOpen = false;
  inputMessage = '';
  isThinking = false;
  messages: Message[] = [
    { text: '¡Hola! Soy tu Asistente. Pregúntame sobre tus gastos, facturas o categorías.', isUser: false }
  ];

  constructor(private chatService: ChatService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    const text = this.inputMessage.trim();
    if (!text || this.isThinking) return;

    this.messages.push({ text, isUser: true });
    this.inputMessage = '';

    this.messages.push({ text: '', isUser: false, isTyping: true });
    this.isThinking = true;

    this.chatService.send(text).subscribe({
      next: (response) => {
        this.messages.pop();
        const isError = response.message.includes('Lo siento');
        this.messages.push({ text: response.message, isUser: false, isError });
        this.isThinking = false;
      },
      error: () => {
        this.messages.pop();
        this.messages.push({
          text: 'Lo siento, como tu copiloto financiero solo puedo ayudarte a analizar tus facturas, gastos y proyecciones. Por favor, hazme una pregunta relacionada con tu negocio.',
          isUser: false,
          isError: true
        });
        this.isThinking = false;
      }
    });
  }
}
