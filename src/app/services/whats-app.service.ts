import { Injectable } from '@angular/core';

export interface WhatsAppProduct {
  name: string;
  description: string;
  image?: string;
  price?: string;
}
@Injectable({
  providedIn: 'root'
})
export class WhatsAppService {
  private readonly whatsappNumber = '17059270127';
  
  constructor() { }

  /**
   * Opens WhatsApp with pre-filled message including product details
   * @param product Product information to send
   */
  sendProductInquiry(product: WhatsAppProduct): void {
    const message = this.formatProductMessage(product);
    this.openWhatsApp(message);
  }

  /**
   * Format product information into WhatsApp message
   * @param product Product details
   * @returns Formatted message string
   */
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

  /**
   * Open WhatsApp with message - tries multiple methods for compatibility
   * @param message Message text
   */
 private openWhatsApp(message: string): void {
  const cleanMessage = message.replace(/\*/g, '');
  const encodedMessage = encodeURIComponent(cleanMessage);
  
  // Use api.whatsapp.com format (works better with business accounts)
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${this.whatsappNumber}&text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
}

  /**
   * Send custom message to WhatsApp
   * @param message Custom message text
   */
  sendCustomMessage(message: string): void {
    this.openWhatsApp(message);
  }

  /**
   * Send general inquiry
   */
  sendGeneralInquiry(): void {
    const message = `Hello Melizzo! 👋\n\nI would like to know more about your products.\n\nThank you!`;
    this.sendCustomMessage(message);
  }
}
