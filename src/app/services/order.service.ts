import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from './cart.service';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface PaymentDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  last4?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  shipping: ShippingAddress;
  payment: PaymentDetails;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingMethod: string;
  createdAt: Date;
  estimatedDelivery: Date;
  trackingNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>(this.loadOrdersFromStorage());
  public orders$: Observable<Order[]> = this.ordersSubject.asObservable();

  constructor() {}

  private loadOrdersFromStorage(): Order[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedOrders = localStorage.getItem('melizzo_orders');
      if (savedOrders) {
        try {
          const orders = JSON.parse(savedOrders);
          // Convert date strings back to Date objects
          return orders.map((order: any) => ({
            ...order,
            createdAt: new Date(order.createdAt),
            estimatedDelivery: new Date(order.estimatedDelivery)
          }));
        } catch (e) {
          console.error('Error loading orders from storage', e);
          return [];
        }
      }
    }
    return [];
  }

  private saveOrdersToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('melizzo_orders', JSON.stringify(this.ordersSubject.value));
    }
  }

  generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `MEL-${timestamp}-${random}`;
  }

  calculateEstimatedDelivery(shippingMethod: string): Date {
    const deliveryDate = new Date();
    
    switch (shippingMethod) {
      case 'standard':
        deliveryDate.setDate(deliveryDate.getDate() + 7); // 5-7 business days
        break;
      case 'express':
        deliveryDate.setDate(deliveryDate.getDate() + 3); // 2-3 business days
        break;
      case 'overnight':
        deliveryDate.setDate(deliveryDate.getDate() + 1); // 1 business day
        break;
      default:
        deliveryDate.setDate(deliveryDate.getDate() + 7);
    }

    return deliveryDate;
  }

  createOrder(
    items: CartItem[],
    shipping: ShippingAddress,
    payment: PaymentDetails,
    subtotal: number,
    tax: number,
    shippingCost: number,
    discount: number,
    total: number,
    shippingMethod: string
  ): Order {
    const order: Order = {
      id: this.generateUniqueId(),
      orderNumber: this.generateOrderNumber(),
      items: [...items],
      shipping: { ...shipping },
      payment: {
        ...payment,
        last4: payment.cardNumber.slice(-4),
        // Remove sensitive card data
        cardNumber: '****',
        cvv: '***'
      },
      subtotal,
      tax,
      shippingCost,
      discount,
      total,
      status: 'pending',
      shippingMethod,
      createdAt: new Date(),
      estimatedDelivery: this.calculateEstimatedDelivery(shippingMethod)
    };

    const currentOrders = this.ordersSubject.value;
    this.ordersSubject.next([order, ...currentOrders]);
    this.saveOrdersToStorage();

    return order;
  }

  private generateUniqueId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getOrderById(orderId: string): Order | undefined {
    return this.ordersSubject.value.find(order => order.id === orderId);
  }

  getOrderByOrderNumber(orderNumber: string): Order | undefined {
    return this.ordersSubject.value.find(order => order.orderNumber === orderNumber);
  }

  getAllOrders(): Order[] {
    return this.ordersSubject.value;
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.ordersSubject.value.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    this.ordersSubject.next(orders);
    this.saveOrdersToStorage();
  }

  addTrackingNumber(orderId: string, trackingNumber: string): void {
    const orders = this.ordersSubject.value.map(order => 
      order.id === orderId ? { ...order, trackingNumber, status: 'shipped' as const } : order
    );
    this.ordersSubject.next(orders);
    this.saveOrdersToStorage();
  }

  cancelOrder(orderId: string): boolean {
    const order = this.getOrderById(orderId);
    
    if (!order) {
      return false;
    }

    // Only allow cancellation for pending and processing orders
    if (order.status === 'pending' || order.status === 'processing') {
      this.updateOrderStatus(orderId, 'cancelled');
      return true;
    }

    return false;
  }

  getOrdersByStatus(status: Order['status']): Order[] {
    return this.ordersSubject.value.filter(order => order.status === status);
  }

  getRecentOrders(limit: number = 5): Order[] {
    return this.ordersSubject.value
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  getTotalOrderValue(): number {
    return this.ordersSubject.value
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);
  }

  getOrderCount(): number {
    return this.ordersSubject.value.length;
  }
}