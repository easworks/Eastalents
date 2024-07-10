import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collab-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collab-popup.component.html',
  styleUrl: './collab-popup.component.less',
})
export class CollabPopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  onClosePopup() {
    this.closePopup.emit();
  }
}
