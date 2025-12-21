import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notifications$: Observable<Notification> = this.notificationSubject.asObservable();

  private defaultDuration = 3000; // 3 seconds

  constructor() {}

  /**
   * Show success notification
   */
  success(message: string, duration?: number): void {
    this.show({
      id: this.generateId(),
      type: 'success',
      message,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Show error notification
   */
  error(message: string, duration?: number): void {
    this.show({
      id: this.generateId(),
      type: 'error',
      message,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Show warning notification
   */
  warning(message: string, duration?: number): void {
    this.show({
      id: this.generateId(),
      type: 'warning',
      message,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Show info notification
   */
  info(message: string, duration?: number): void {
    this.show({
      id: this.generateId(),
      type: 'info',
      message,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Show generic notification
   */
  private show(notification: Notification): void {
    this.notificationSubject.next(notification);
  }

  /**
   * Generate unique ID for notification
   */
  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}