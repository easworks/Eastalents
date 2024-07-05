import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'filter-sidepanel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-sidepanel.component.html',
})
export class FilterComponent {
  @Output() closePopup = new EventEmitter<void>();

  onClosePopup() {
    this.closePopup.emit();
  }
}
