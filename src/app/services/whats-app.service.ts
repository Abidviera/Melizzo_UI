import { Injectable } from '@angular/core';

export interface WhatsAppProduct {
  name: string;
  description: string;
  image?: string;
  price?: string;
}
@Injectable({
  providedIn: 'root',
})
export class WhatsAppService {
  private readonly whatsappNumber = '17059270127';

  constructor() {}

  sendProductInquiry(product: WhatsAppProduct): void {
    const message = this.formatProductMessage(product);
    this.openWhatsApp(message);
  }

  private formatProductMessage(product: WhatsAppProduct): string {
    let message = `Hello Melizzo! 👋\n\n`;
    message += `I'm interested in ordering:\n\n`;
    message += `📦 ${product.name}\n\n`;

    if (product.description) {
      message += `${product.description}\n\n`;
    }

    if (product.price) {
      message += `💰 Price: ${product.price}\n\n`;
    }

    message += `Could you please provide more details about:\n`;
    message += `• Availability\n`;
    message += `• Delivery options\n`;
    message += `• Payment methods\n\n`;
    message += `Thank you! 😊`;

    return message;
  }

  private openWhatsApp(message: string): void {
    const cleanMessage = message.replace(/\*/g, '');
    const encodedMessage = encodeURIComponent(cleanMessage);

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${this.whatsappNumber}&text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  }

  sendCustomMessage(message: string): void {
    this.openWhatsApp(message);
  }

  sendGeneralInquiry(): void {
    const message = `Hello Melizzo! 👋\n\nI would like to know more about your products.\n\nThank you!`;
    this.sendCustomMessage(message);
  }
}
