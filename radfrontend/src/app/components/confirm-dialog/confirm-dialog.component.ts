import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirm-overlay" [class.open]="isOpen" (click)="cancel()">
      <div class="confirm-dialog" (click)="$event.stopPropagation()">
        <div class="confirm-header">
          <div class="confirm-icon">
            <i class="fas" 
               [class.fa-exclamation-triangle]="type === 'warning'"
               [class.fa-question-circle]="type === 'question'"
               [class.fa-info-circle]="type === 'info'"></i>
          </div>
          <h3>{{ title }}</h3>
        </div>
        <div class="confirm-body">
          <p>{{ message }}</p>
        </div>
        <div class="confirm-actions">
          <button class="btn-cancel" (click)="cancel()">
            <i class="fas fa-times"></i> {{ cancelText }}
          </button>
          <button class="btn-confirm" (click)="confirm()" [class.danger]="type === 'warning'">
            <i class="fas fa-check"></i> {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      backdrop-filter: blur(5px);
    }
    .confirm-overlay.open {
      opacity: 1;
      visibility: visible;
    }
    .confirm-dialog {
      background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);
      border-radius: 20px;
      padding: 2rem;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 165, 0, 0.2);
      transform: scale(0.9);
      transition: transform 0.3s ease;
    }
    .confirm-overlay.open .confirm-dialog {
      transform: scale(1);
    }
    .confirm-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .confirm-icon {
      font-size: 2.5rem;
      color: #FFA500;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 165, 0, 0.1);
      border-radius: 50%;
    }
    .confirm-header h3 {
      margin: 0;
      color: white;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .confirm-body {
      margin-bottom: 2rem;
    }
    .confirm-body p {
      color: #CCC;
      font-size: 1rem;
      line-height: 1.6;
      margin: 0;
    }
    .confirm-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
    .btn-cancel,
    .btn-confirm {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-cancel {
      background: transparent;
      color: #999;
      border: 1px solid #444;
    }
    .btn-cancel:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: #666;
      color: white;
    }
    .btn-confirm {
      background: #FFA500;
      color: white;
    }
    .btn-confirm:hover {
      background: #FFB347;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
    }
    .btn-confirm.danger {
      background: #F44336;
    }
    .btn-confirm.danger:hover {
      background: #E53935;
      box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmation';
  @Input() message = 'Êtes-vous sûr ?';
  @Input() confirmText = 'Confirmer';
  @Input() cancelText = 'Annuler';
  @Input() type: 'question' | 'warning' | 'info' = 'question';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm() {
    this.confirmed.emit();
    this.isOpen = false;
  }

  cancel() {
    this.cancelled.emit();
    this.isOpen = false;
  }
}




