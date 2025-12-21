// toast-notification.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Notification, NotificationService } from '../../../services/notification.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface ActiveNotification extends Notification {
  visible: boolean;
  timeoutId?: any;
}
@Component({
  selector: 'app-toast-notification',
  standalone: false,
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.scss',
  animations: [
    trigger('slideIn', [
      state('void', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('300ms ease-in'))
    ])
  ]
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  notifications: ActiveNotification[] = [];
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        this.addNotification(notification);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clear all timeouts
    this.notifications.forEach(n => {
      if (n.timeoutId) {
        clearTimeout(n.timeoutId);
      }
    });
  }

  private addNotification(notification: Notification): void {
    const activeNotification: ActiveNotification = {
      ...notification,
      visible: true
    };

    this.notifications.push(activeNotification);

    // Auto-dismiss after duration
    const duration = notification.duration || 3000;
    activeNotification.timeoutId = setTimeout(() => {
      this.removeNotification(notification.id);
    }, duration);

    // Limit to 5 notifications at a time
    if (this.notifications.length > 5) {
      this.removeNotification(this.notifications[0].id);
    }
  }

  removeNotification(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      const notification = this.notifications[index];
      if (notification.timeoutId) {
        clearTimeout(notification.timeoutId);
      }
      this.notifications.splice(index, 1);
    }
  }

  getIcon(type: Notification['type']): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  }
}