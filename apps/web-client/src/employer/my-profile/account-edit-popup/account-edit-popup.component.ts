import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';

@Component({
  selector: 'app-account-edit-popup',
  standalone: true,
  templateUrl: './account-edit-popup.component.html',
  styleUrl: './account-edit-popup.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule
  ],
})
export class AccountEditPopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  protected readonly form = new FormGroup({
    name: new FormControl(""),
    email: new FormControl(""),
    phone: new FormControl(""),
    jobTitle: new FormControl(""),
  });

  onClosePopup() {
    this.closePopup.emit();
  }
}
