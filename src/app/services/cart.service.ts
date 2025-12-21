import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  size?: string;
  maxQuantity?: number;
  description?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>(this.getInitialCart());
  public cart$: Observable<Cart> = this.cartSubject.asObservable();

  private wishlistSubject = new BehaviorSubject<CartItem[]>(this.getInitialWishlist());
  public wishlist$: Observable<CartItem[]> = this.wishlistSubject.asObservable();

  // Tax rate for HST in Ontario, Canada (13%)
  private readonly TAX_RATE = 0.13;
  
  // Free shipping threshold
  private readonly FREE_SHIPPING_THRESHOLD = 100;
  
  // Standard shipping cost
  private readonly SHIPPING_COST = 15;

  constructor() {
    this.loadCartFromStorage();
    this.loadWishlistFromStorage();
  }

  private getInitialCart(): Cart {
    return {
      items: [],
      total: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0
    };
  }

  private getInitialWishlist(): CartItem[] {
    return [];
  }

  private loadCartFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedCart = localStorage.getItem('melizzo_cart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          this.cartSubject.next(cart);
        } catch (e) {
          console.error('Error loading cart from storage', e);
        }
      }
    }
  }

  private loadWishlistFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedWishlist = localStorage.getItem('melizzo_wishlist');
      if (savedWishlist) {
        try {
          const wishlist = JSON.parse(savedWishlist);
          this.wishlistSubject.next(wishlist);
        } catch (e) {
          console.error('Error loading wishlist from storage', e);
        }
      }
    }
  }

  private saveCartToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('melizzo_cart', JSON.stringify(this.cartSubject.value));
    }
  }

  private saveWishlistToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('melizzo_wishlist', JSON.stringify(this.wishlistSubject.value));
    }
  }

  private calculateCart(items: CartItem[]): Cart {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const currentDiscount = this.cartSubject.value?.discount || 0;
    const tax = (subtotal - currentDiscount) * this.TAX_RATE;
    const shipping = subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_COST;
    const total = subtotal + tax + shipping - currentDiscount;

    return {
      items,
      subtotal,
      tax,
      shipping,
      discount: currentDiscount,
      total: Math.max(0, total)
    };
  }

  addToCart(item: CartItem): boolean {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(
      i => i.id === item.id && i.variant === item.variant && i.size === item.size
    );

    let newItems: CartItem[];

    if (existingItemIndex > -1) {
      newItems = [...currentCart.items];
      const maxQty = item.maxQuantity || 99;
      const newQuantity = newItems[existingItemIndex].quantity + item.quantity;
      
      if (newQuantity > maxQty) {
        console.warn(`Cannot add more than ${maxQty} items`);
        return false;
      }
      
      newItems[existingItemIndex].quantity = newQuantity;
    } else {
      newItems = [...currentCart.items, { ...item }];
    }

    const updatedCart = this.calculateCart(newItems);
    this.cartSubject.next(updatedCart);
    this.saveCartToStorage();
    return true;
  }

  removeFromCart(itemId: string, variant?: string, size?: string): void {
    const currentCart = this.cartSubject.value;
    const newItems = currentCart.items.filter(
      item => !(item.id === itemId && item.variant === variant && item.size === size)
    );

    const updatedCart = this.calculateCart(newItems);
    this.cartSubject.next(updatedCart);
    this.saveCartToStorage();
  }

  updateQuantity(itemId: string, quantity: number, variant?: string, size?: string): void {
    if (quantity < 1) {
      this.removeFromCart(itemId, variant, size);
      return;
    }

    const currentCart = this.cartSubject.value;
    const newItems = currentCart.items.map(item => {
      if (item.id === itemId && item.variant === variant && item.size === size) {
        const maxQty = item.maxQuantity || 99;
        return { ...item, quantity: Math.min(quantity, maxQty) };
      }
      return item;
    });

    const updatedCart = this.calculateCart(newItems);
    this.cartSubject.next(updatedCart);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartSubject.next(this.getInitialCart());
    this.saveCartToStorage();
  }

  getCartItemCount(): number {
    return this.cartSubject.value.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }

  // Wishlist methods
  addToWishlist(item: CartItem): boolean {
    const currentWishlist = this.wishlistSubject.value;
    const exists = currentWishlist.some(
      i => i.id === item.id && i.variant === item.variant
    );

    if (exists) {
      return false;
    }

    const newWishlist = [...currentWishlist, { ...item, quantity: 1 }];
    this.wishlistSubject.next(newWishlist);
    this.saveWishlistToStorage();
    return true;
  }

  removeFromWishlist(itemId: string, variant?: string): void {
    const currentWishlist = this.wishlistSubject.value;
    const newWishlist = currentWishlist.filter(
      item => !(item.id === itemId && item.variant === variant)
    );
    this.wishlistSubject.next(newWishlist);
    this.saveWishlistToStorage();
  }

  isInWishlist(itemId: string, variant?: string): boolean {
    return this.wishlistSubject.value.some(
      item => item.id === itemId && item.variant === variant
    );
  }

  moveWishlistToCart(itemId: string, variant?: string): void {
    const item = this.wishlistSubject.value.find(
      i => i.id === itemId && i.variant === variant
    );

    if (item) {
      this.addToCart(item);
      this.removeFromWishlist(itemId, variant);
    }
  }

  getWishlistCount(): number {
    return this.wishlistSubject.value.length;
  }

  applyPromoCode(code: string): { success: boolean; message: string; discount: number } {
    const currentCart = this.cartSubject.value;
    let discount = 0;
    let message = '';

    // Convert to uppercase for comparison
    const upperCode = code.toUpperCase().trim();

    // Define promo codes
    const promoCodes: { [key: string]: { discount: number; type: 'percentage' | 'fixed' } } = {
      'WELCOME10': { discount: 0.10, type: 'percentage' },
      'MELIZZO20': { discount: 0.20, type: 'percentage' },
      'SAVE25': { discount: 25, type: 'fixed' },
      'FIRSTORDER': { discount: 0.15, type: 'percentage' }
    };

    if (promoCodes[upperCode]) {
      const promo = promoCodes[upperCode];
      
      if (promo.type === 'percentage') {
        discount = currentCart.subtotal * promo.discount;
        message = `${promo.discount * 100}% discount applied!`;
      } else {
        discount = promo.discount;
        message = `$${promo.discount} discount applied!`;
      }

      // Ensure discount doesn't exceed subtotal
      discount = Math.min(discount, currentCart.subtotal);

      const updatedCart = {
        ...currentCart,
        discount,
        tax: (currentCart.subtotal - discount) * this.TAX_RATE,
        total: currentCart.subtotal + (currentCart.subtotal - discount) * this.TAX_RATE + currentCart.shipping - discount
      };

      this.cartSubject.next(updatedCart);
      this.saveCartToStorage();

      return { success: true, message, discount };
    }

    return { success: false, message: 'Invalid promo code', discount: 0 };
  }

  removePromoCode(): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = {
      ...currentCart,
      discount: 0,
      tax: currentCart.subtotal * this.TAX_RATE,
      total: currentCart.subtotal + currentCart.subtotal * this.TAX_RATE + currentCart.shipping
    };

    this.cartSubject.next(updatedCart);
    this.saveCartToStorage();
  }
}