import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cart, CartItem, CartService } from '../../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
   cart: Cart | null = null;
  promoCode = '';
  promoError = '';
  promoSuccess = '';
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = cart;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(item);
      return;
    }

    const maxQty = item.maxQuantity || 99;
    if (quantity > maxQty) {
      this.notificationService.warning(`Maximum quantity for this item is ${maxQty}`);
      return;
    }

    this.cartService.updateQuantity(item.id, quantity, item.variant, item.size);
  }

  removeItem(item: CartItem): void {
    // Confirm before removing
    if (confirm(`Remove ${item.name} from cart?`)) {
      this.cartService.removeFromCart(item.id, item.variant, item.size);
      this.notificationService.success(`${item.name} removed from cart`);
    }
  }

  applyPromo(): void {
    this.promoError = '';
    this.promoSuccess = '';

    if (!this.promoCode.trim()) {
      this.promoError = 'Please enter a promo code';
      return;
    }

    const result = this.cartService.applyPromoCode(this.promoCode);

    if (result.success) {
      this.promoSuccess = result.message;
      this.notificationService.success(result.message);
      this.promoCode = '';

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.promoSuccess = '';
      }, 3000);
    } else {
      this.promoError = result.message;
    }
  }

  removePromo(): void {
    this.cartService.removePromoCode();
    this.notificationService.info('Promo code removed');
    this.promoCode = '';
    this.promoError = '';
    this.promoSuccess = '';
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  proceedToCheckout(): void {
    if (this.cart && this.cart.items.length > 0) {
      this.router.navigate(['/checkout']);
    } else {
      this.notificationService.warning('Your cart is empty');
    }
  }

  get isEmpty(): boolean {
    return !this.cart || this.cart.items.length === 0;
  }

  get hasDiscount(): boolean {
    return this.cart ? this.cart.discount > 0 : false;
  }

  get freeShippingRemaining(): number {
    if (!this.cart) return 100;
    return Math.max(0, 100 - this.cart.subtotal);
  }

  get isFreeShipping(): boolean {
    return this.freeShippingRemaining === 0;
  }
}
