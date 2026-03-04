import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();
  private notificationId = 0;

  show(notification: Omit<Notification, 'id'>) {
    const id = ++this.notificationId;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 4000
    };

    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, newNotification]);

    if (newNotification.duration !== undefined && newNotification.duration > 0) {
      setTimeout(() => this.remove(id), newNotification.duration);
    }

    return id;
  }

  success(message: string, duration?: number) {
    return this.show({ type: 'success', message, duration });
  }

  error(message: string, duration?: number) {
    return this.show({ type: 'error', message, duration: duration || 6000 });
  }

  warning(message: string, duration?: number) {
    return this.show({ type: 'warning', message, duration });
  }

  info(message: string, duration?: number) {
    return this.show({ type: 'info', message, duration });
  }

  remove(id: number) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next(current.filter(n => n.id !== id));
  }

  clear() {
    this.notificationsSubject.next([]);
  }
}

