import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDefinition, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PopupComponent } from './popup/popup.component';

@Component({
  selector: 'app-my-collabrator',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule,PopupComponent],
  templateUrl: './manage-collabrator.component.html',
})
export class ManageCollabratorComponent {
  menuIcon: IconDefinition = faEllipsisVertical
  showPopup: boolean =false
  showAddPopup: boolean = false
  setShowPopup() {
    this.showPopup = !this.showPopup;
  }
  setShowAddPopup() {
    this.showAddPopup = !this.showAddPopup;
  }
}
