import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-core-skill-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './update-core-skill-popup.component.html',
  styleUrl: './update-core-skill-popup.component.less',
})
export class UpdateCoreSkillPopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  onClosePopup() {
    this.closePopup.emit();
  }
}
