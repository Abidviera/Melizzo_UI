import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface PaymentRequest {
  amount: number;
  currency: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  email: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  // Set to true to use mock payments (for development)
  // Set to false to use real Stripe integration (for production)
  private useMockPayment = true;

  // Stripe publishable key (replace with your own)
  private stripePublishableKey = 'pk_test_YOUR_STRIPE_KEY_HERE';

  constructor() {
    // In a real application, you would load Stripe.js here
    // this.loadStripe();
  }

  /**
   * Process payment
   * In development, this uses mock payment processing
   * In production, this would integrate with Stripe or another payment gateway
   */
  processPayment(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    if (this.useMockPayment) {
      return this.processMockPayment(paymentRequest);
    } else {
      return this.processStripePayment(paymentRequest);
    }
  }

  /**
   * Mock payment processing for development
   * Simulates payment processing with validation
   */
  private processMockPayment(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    // Validate payment request
    const validation = this.validatePaymentRequest(paymentRequest);
    // if (!validation.valid) {
    //   return throwError(() => ({
    //     success: false,
    //     message: 'Payment validation failed',
    //     error: validation.error
    //   })).pipe(delay(500));
    // }

    // Simulate payment processing delay (1-2 seconds)
    return of(null).pipe(
      delay(1500),
      map(() => {
        // Simulate success rate (95% success, 5% failure for testing)
        const isSuccessful = Math.random() > 0.05;

        if (isSuccessful) {
          return {
            success: true,
            transactionId: this.generateMockTransactionId(),
            message: 'Payment processed successfully'
          };
        } else {
          return {
            success: false,
            message: 'Payment declined',
            error: 'Insufficient funds or card declined'
          };
        }
      })
    );
  }

  /**
   * Validate payment request
   */
  private validatePaymentRequest(request: PaymentRequest): { valid: boolean; error?: string } {
    // Validate amount
    if (request.amount <= 0) {
      return { valid: false, error: 'Invalid amount' };
    }

    // Validate card number (basic Luhn algorithm check)
    const cardNumber = request.cardNumber.replace(/\s/g, '');
    if (!this.isValidCardNumber(cardNumber)) {
      return { valid: false, error: 'Invalid card number' };
    }

    // Validate expiry date
    if (!this.isValidExpiryDate(request.expiryDate)) {
      return { valid: false, error: 'Card has expired or invalid expiry date' };
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(request.cvv)) {
      return { valid: false, error: 'Invalid CVV' };
    }

    // Validate card name
    if (!request.cardName || request.cardName.trim().length < 3) {
      return { valid: false, error: 'Invalid cardholder name' };
    }

    // Validate email
    if (!this.isValidEmail(request.email)) {
      return { valid: false, error: 'Invalid email address' };
    }

    return { valid: true };
  }

  /**
   * Luhn algorithm for card number validation
   */
  private isValidCardNumber(cardNumber: string): boolean {
    if (!/^\d{13,19}$/.test(cardNumber)) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate expiry date (MM/YY format)
   */
  private isValidExpiryDate(expiryDate: string): boolean {
    const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
    if (!match) {
      return false;
    }

    const month = parseInt(match[1], 10);
    const year = parseInt('20' + match[2], 10);

    if (month < 1 || month > 12) {
      return false;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
  }

  /**
   * Validate email address
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generate mock transaction ID
   */
  private generateMockTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `txn_${timestamp}_${random}`;
  }

  /**
   * Process payment with Stripe (for production)
   * This is a placeholder - implement actual Stripe integration
   */
  private processStripePayment(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    // In a real application, you would:
    // 1. Create a payment intent on your backend
    // 2. Confirm the payment with Stripe
    // 3. Handle the response

    console.warn('Stripe integration not implemented. Using mock payment.');
    return this.processMockPayment(paymentRequest);
  }

  /**
   * Get card type from card number
   */
  getCardType(cardNumber: string): string {
    const number = cardNumber.replace(/\s/g, '');

    if (/^4/.test(number)) {
      return 'Visa';
    } else if (/^5[1-5]/.test(number)) {
      return 'Mastercard';
    } else if (/^3[47]/.test(number)) {
      return 'American Express';
    } else if (/^6(?:011|5)/.test(number)) {
      return 'Discover';
    } else {
      return 'Unknown';
    }
  }

  /**
   * Format card number with spaces
   */
  formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    const matches = cleaned.match(/\d{1,4}/g);
    return matches ? matches.join(' ') : '';
  }

  /**
   * Format expiry date (MM/YY)
   */
  formatExpiryDate(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  }
}