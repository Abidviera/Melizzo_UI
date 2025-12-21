import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Cart, CartService } from '../../../services/cart.service';
import { PaymentService, PaymentRequest } from '../../../services/payment.service';
import { OrderService, ShippingAddress } from '../../../services/order.service';
import { NotificationService } from '../../../services/notification.service';

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

interface PaymentForm {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  time: string;
  price: number;
}

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  currentStep = 1;
  isProcessing = false;

  shippingForm: ShippingForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    province: 'Ontario',
    postalCode: '',
    country: 'Canada'
  };

  paymentForm: PaymentForm = {
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  };

  shippingMethods: ShippingMethod[] = [
    { id: 'standard', name: 'Standard Shipping', time: '5-7 business days', price: 15 },
    { id: 'express', name: 'Express Shipping', time: '2-3 business days', price: 25 },
    { id: 'overnight', name: 'Overnight Shipping', time: '1 business day', price: 45 }
  ];

  selectedShippingMethod = 'standard';

  provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec',
    'Saskatchewan', 'Yukon'
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = cart;
        if (!cart || cart.items.length === 0) {
          this.notificationService.warning('Your cart is empty');
          this.router.navigate(['/cart']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToStep(step: number): void {
    if (step < this.currentStep) {
      this.currentStep = step;
    }
  }

  continueToPayment(): void {
    if (this.validateShippingForm()) {
      this.currentStep = 2;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  continueToReview(): void {
    if (this.validatePaymentForm()) {
      this.currentStep = 3;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  backToCart(): void {
    this.router.navigate(['/cart']);
  }

  backToShipping(): void {
    this.currentStep = 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  backToPayment(): void {
    this.currentStep = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  validateShippingForm(): boolean {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
    
    for (const field of required) {
      if (!this.shippingForm[field as keyof ShippingForm]) {
        this.notificationService.error(`Please fill in ${this.formatFieldName(field)}`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.shippingForm.email)) {
      this.notificationService.error('Please enter a valid email address');
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(this.shippingForm.phone) || this.shippingForm.phone.length < 10) {
      this.notificationService.error('Please enter a valid phone number');
      return false;
    }

    // Postal code validation for Canada (basic)
    const postalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!postalRegex.test(this.shippingForm.postalCode)) {
      this.notificationService.error('Please enter a valid Canadian postal code (e.g., K9H 0K1)');
      return false;
    }

    return true;
  }

  validatePaymentForm(): boolean {
    if (!this.paymentForm.cardNumber || !this.paymentForm.cardName || 
        !this.paymentForm.expiryDate || !this.paymentForm.cvv) {
      this.notificationService.error('Please fill in all payment details');
      return false;
    }

    // Card number validation (16 digits)
    const cardNumber = this.paymentForm.cardNumber.replace(/\s/g, '');
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      this.notificationService.error('Please enter a valid 16-digit card number');
      return false;
    }

    // Expiry date validation
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(this.paymentForm.expiryDate)) {
      this.notificationService.error('Please enter a valid expiry date (MM/YY)');
      return false;
    }

    // Check if card is expired
    const [month, year] = this.paymentForm.expiryDate.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      this.notificationService.error('Your card has expired');
      return false;
    }

    // CVV validation (3-4 digits)
    if (!/^\d{3,4}$/.test(this.paymentForm.cvv)) {
      this.notificationService.error('Please enter a valid CVV (3-4 digits)');
      return false;
    }

    // Cardholder name validation
    if (this.paymentForm.cardName.trim().length < 3) {
      this.notificationService.error('Please enter a valid cardholder name');
      return false;
    }

    return true;
  }

  formatFieldName(field: string): string {
    return field.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase());
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = '';
    
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    
    this.paymentForm.cardNumber = formattedValue;
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    this.paymentForm.expiryDate = value;
  }

  selectShippingMethod(methodId: string): void {
    this.selectedShippingMethod = methodId;
  }

  getSelectedShippingPrice(): number {
    const method = this.shippingMethods.find(m => m.id === this.selectedShippingMethod);
    return method ? method.price : 0;
  }

  get totalWithShipping(): number {
    if (!this.cart) return 0;
    const shippingCost = this.getSelectedShippingPrice();
    return this.cart.subtotal + this.cart.tax + shippingCost - this.cart.discount;
  }

  async placeOrder(): Promise<void> {
    if (!this.cart || this.cart.items.length === 0) {
      this.notificationService.error('Cart is empty');
      return;
    }

    this.isProcessing = true;

    try {
      // Prepare payment request
      const paymentRequest: PaymentRequest = {
        amount: this.totalWithShipping,
        currency: 'CAD',
        cardNumber: this.paymentForm.cardNumber.replace(/\s/g, ''),
        cardName: this.paymentForm.cardName,
        expiryDate: this.paymentForm.expiryDate,
        cvv: this.paymentForm.cvv,
        email: this.shippingForm.email
      };

      // Store cart reference to avoid null issues
      const currentCart = this.cart;

      // Process payment
      this.paymentService.processPayment(paymentRequest).subscribe({
        next: (response) => {
          if (response.success && currentCart) {
            // Payment successful, create order
            const shippingAddress: ShippingAddress = {
              firstName: this.shippingForm.firstName,
              lastName: this.shippingForm.lastName,
              email: this.shippingForm.email,
              phone: this.shippingForm.phone,
              address: this.shippingForm.address,
              apartment: this.shippingForm.apartment,
              city: this.shippingForm.city,
              province: this.shippingForm.province,
              postalCode: this.shippingForm.postalCode,
              country: this.shippingForm.country
            };

            const order = this.orderService.createOrder(
              currentCart.items,
              shippingAddress,
              this.paymentForm,
              currentCart.subtotal,
              currentCart.tax,
              this.getSelectedShippingPrice(),
              currentCart.discount,
              this.totalWithShipping,
              this.selectedShippingMethod
            );

            // Clear cart
            this.cartService.clearCart();

            // Show success message
            this.notificationService.success('Order placed successfully!');

            // Navigate to confirmation page
            this.router.navigate(['/payment'], {
              state: {
                order: {
                  id: order.orderNumber,
                  shipping: shippingAddress,
                  items: order.items,
                  total: order.total,
                  estimatedDelivery: order.estimatedDelivery
                }
              }
            });
          } else {
            // Payment failed
            this.isProcessing = false;
            this.notificationService.error(response.message || 'Payment failed. Please try again.');
          }
        },
        error: (error) => {
          this.isProcessing = false;
          this.notificationService.error(error.message || 'Payment processing failed. Please try again.');
          console.error('Payment error:', error);
        }
      });
    } catch (error) {
      this.isProcessing = false;
      this.notificationService.error('An unexpected error occurred. Please try again.');
      console.error('Order placement error:', error);
    }
  }
} 