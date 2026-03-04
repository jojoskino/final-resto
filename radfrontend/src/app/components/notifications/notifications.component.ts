import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div 
        *ngFor="let notification of notifications" 
        class="notification"
        [class.success]="notification.type === 'success'"
        [class.error]="notification.type === 'error'"
        [class.warning]="notification.type === 'warning'"
        [class.info]="notification.type === 'info'"
        >
        <div class="notification-icon">
          <i class="fas" 
             [class.fa-check-circle]="notification.type === 'success'"
             [class.fa-exclamation-circle]="notification.type === 'error'"
             [class.fa-exclamation-triangle]="notification.type === 'warning'"
             [class.fa-info-circle]="notification.type === 'info'"></i>
        </div>
        <div class="notification-content">
          <p>{{ notification.message }}</p>
        </div>
        <button class="notification-close" (click)="remove(notification.id)">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
      pointer-events: none;
    }
    .notification {
      background: #2A2A2A;
      border-radius: 12px;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      border-left: 4px solid;
      pointer-events: all;
      animation: slideInRight 0.3s ease-out;
      min-width: 300px;
    }
    .notification.success {
      border-left-color: #4CAF50;
      background: linear-gradient(135deg, #2A2A2A 0%, rgba(76, 175, 80, 0.1) 100%);
    }
    .notification.error {
      border-left-color: #F44336;
      background: linear-gradient(135deg, #2A2A2A 0%, rgba(244, 67, 54, 0.1) 100%);
    }
    .notification.warning {
      border-left-color: #FFA500;
      background: linear-gradient(135deg, #2A2A2A 0%, rgba(255, 165, 0, 0.1) 100%);
    }
    .notification.info {
      border-left-color: #2196F3;
      background: linear-gradient(135deg, #2A2A2A 0%, rgba(33, 150, 243, 0.1) 100%);
    }
    .notification-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    .notification.success .notification-icon {
      color: #4CAF50;
    }
    .notification.error .notification-icon {
      color: #F44336;
    }
    .notification.warning .notification-icon {
      color: #FFA500;
    }
    .notification.info .notification-icon {
      color: #2196F3;
    }
    .notification-content {
      flex: 1;
      color: white;
    }
    .notification-content p {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    .notification-close {
      background: transparent;
      border: none;
      color: #999;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.25rem;
      border-radius: 4px;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    .notification-close:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @media (max-width: 768px) {
      .notifications-container {
        right: 10px;
        left: 10px;
        max-width: none;
      }
      .notification {
        min-width: auto;
      }
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  remove(id: number) {
    this.notificationService.remove(id);
  }
}

