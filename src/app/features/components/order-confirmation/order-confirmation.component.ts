import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss'
})
export class OrderConfirmationComponent implements OnInit {
 orderDetails: any = null;
  orderNumber = '';
  estimatedDelivery = '';

  constructor(private router: Router) {
    // Get order details from navigation state
    const navigation = this.router.getCurrentNavigation();
    this.orderDetails = navigation?.extras?.state?.['order'];
  }

  ngOnInit(): void {
    // If no order details, redirect to home
    if (!this.orderDetails) {
      this.router.navigate(['/']);
      return;
    }

    // Set order number
    this.orderNumber = this.orderDetails.id || 'ORD-' + Date.now();

    // Format estimated delivery date
    if (this.orderDetails.estimatedDelivery) {
      const deliveryDate = new Date(this.orderDetails.estimatedDelivery);
      this.estimatedDelivery = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      // Calculate default delivery date (7 days from now)
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 7);
      this.estimatedDelivery = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  printOrder(): void {
    window.print();
  }

  viewOrderDetails(): void {
    // Navigate to orders page (to be implemented)
    this.router.navigate(['/orders']);
  }

  trackOrder(): void {
    // Navigate to order tracking (to be implemented)
    console.log('Track order:', this.orderNumber);
  }
}
