import { Component } from '@angular/core';
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
}

interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'shipping';
  freeShipping?: boolean;
}
@Component({
  selector: 'app-checkout-sidebar',
  standalone: false,
  templateUrl: './checkout-sidebar.component.html',
  styleUrl: './checkout-sidebar.component.scss'
})
export class CheckoutSidebarComponent {
 isOpen = true;
  couponCode = '';
  appliedCoupon: Coupon | null = null;
  
  cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Kunafa Pistachio Dubai Chocolate',
      price: 45.00,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=200&h=200&fit=crop',
      size: '200g Bar'
    },
    {
      id: 2,
      name: 'Angel Hair Dubai Chocolate',
      price: 42.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=200&h=200&fit=crop',
      size: '200g Bar'
    },
    {
      id: 3,
      name: 'Premium Truffle Collection',
      price: 65.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1587132164684-cfd0b8214d8e?w=200&h=200&fit=crop',
      size: 'Gift Box - 12 pieces'
    }
  ];

  validCoupons: { [key: string]: Omit<Coupon, 'code'> } = {
    'MELIZZO15': { discount: 15, type: 'percentage' },
    'WELCOME10': { discount: 10, type: 'percentage' },
    'FREESHIP': { discount: 0, type: 'shipping', freeShipping: true }
  };

  constructor() { }

  ngOnInit(): void { }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  updateQuantity(id: number, change: number): void {
    const item = this.cartItems.find(i => i.id === id);
    if (item) {
      item.quantity = Math.max(1, item.quantity + change);
    }
  }

  removeItem(id: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
  }

  applyCoupon(): void {
    const couponKey = this.couponCode.toUpperCase();
    if (this.validCoupons[couponKey]) {
      this.appliedCoupon = {
        code: couponKey,
        ...this.validCoupons[couponKey]
      };
    }
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.couponCode = '';
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get shipping(): number {
    return this.appliedCoupon?.freeShipping ? 0 : 12.00;
  }

  get discount(): number {
    return this.appliedCoupon?.type === 'percentage' 
      ? (this.subtotal * (this.appliedCoupon.discount / 100)) 
      : 0;
  }

  get tax(): number {
    return (this.subtotal - this.discount) * 0.05;
  }

  get total(): number {
    return this.subtotal - this.discount + this.shipping + this.tax;
  }

  get cartCount(): number {
    return this.cartItems.length;
  }

  get freeShippingRemaining(): number {
    return Math.max(0, 100 - this.subtotal);
  }

  proceedToCheckout(): void {
    console.log('Proceeding to checkout with:', {
      items: this.cartItems,
      total: this.total,
      coupon: this.appliedCoupon
    });
    // Navigate to checkout page or process order
  }
}
