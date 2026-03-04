import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalHelperService {
  
  openModal() {
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }
}





